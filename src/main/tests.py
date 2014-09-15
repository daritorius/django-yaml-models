import datetime
import json
from django.http import QueryDict
from django.test import TestCase, RequestFactory, Client
from main.models import Users, Rooms
from main.views import ajax_load_view, index_view, ajax_create_view, ajax_update_view


class Tests(TestCase):
    users_data = [
        {"name": "1User", "paycheck": 1000, "date_joined": datetime.datetime.today()},
        {"name": "2User", "paycheck": 2000, "date_joined": datetime.datetime.today()},
        {"name": "3User", "paycheck": 3000, "date_joined": datetime.datetime.today()},
    ]
    rooms_data = [
        {"department": "1Room", "spots": 1, "number": 2},
        {"department": "2Room", "spots": 2, "number": 3},
        {"department": "3Room", "spots": 3, "number": 4},
    ]

    def setUp(self):
        self.factory = RequestFactory()
        self.client = Client()
        for item in self.users_data:
            Users.objects.create(**item)
        for item in self.rooms_data:
            Rooms.objects.create(**item)

    def test_users_models(self):
        users_objects = Users.objects.all().order_by("id")
        self.assertEqual(self.users_data[0]["name"], users_objects[0].name)
        self.assertEqual(self.users_data[1]["name"], users_objects[1].name)
        self.assertEqual(self.users_data[2]["name"], users_objects[2].name)

    def test_rooms_models(self):
        rooms_objects = Rooms.objects.all().order_by("id")
        self.assertEqual(self.rooms_data[0]["department"], rooms_objects[0].department)
        self.assertEqual(self.rooms_data[1]["department"], rooms_objects[1].department)
        self.assertEqual(self.rooms_data[2]["department"], rooms_objects[2].department)

    def test_load_users(self):
        request_data = {"type": "users"}
        request = self.factory.get("/ajax/load/", request_data)
        response = ajax_load_view(request)
        self.assertEqual(response.status_code, 200)
        objects_list = json.loads(json.loads(response.content)["objects"])
        users_objects = Users.objects.all().order_by("id")
        self.assertEqual(objects_list[0]["pk"], users_objects[0].id)
        self.assertEqual(objects_list[1]["pk"], users_objects[1].id)
        self.assertEqual(objects_list[2]["pk"], users_objects[2].id)

    def test_load_rooms(self):
        request_data = {"type": "rooms"}
        request = self.factory.get("/ajax/load/", request_data)
        response = ajax_load_view(request)
        self.assertEqual(response.status_code, 200)
        objects_list = json.loads(json.loads(response.content)["objects"])
        rooms_objects = Rooms.objects.all().order_by("id")
        self.assertEqual(objects_list[0]["pk"], rooms_objects[0].id)
        self.assertEqual(objects_list[1]["pk"], rooms_objects[1].id)
        self.assertEqual(objects_list[2]["pk"], rooms_objects[2].id)

    def test_create_user(self):
        request_data = {"type": "users", "name": "4User", "paycheck": 4000, "date_joined": "2014-09-06"}
        request = self.factory.post("/ajax/create/", request_data)
        response = ajax_create_view(request)
        self.assertEqual(response.status_code, 200)
        user_object = Users.objects.all().order_by("-id")[0]
        self.assertEqual(user_object.name, request_data["name"])

    def test_create_room(self):
        request_data = {"type": "rooms", "department": "1Room", "spots": 4, "number": 5}
        request = self.factory.post("/ajax/create/", request_data)
        response = ajax_create_view(request)
        self.assertEqual(response.status_code, 200)
        room_object = Rooms.objects.all().order_by("-id")[0]
        self.assertEqual(room_object.department, request_data["department"])

    def test_update_users(self):
        request_data = {
            "type": "users",
            "users": [
                u'{"3": {"data": {"name": "31User", "paycheck": "3100", "date_joined": "2014-09-03"}}}'
            ]
        }
        request = self.factory.post("/ajax/update/", request_data)
        response = ajax_update_view(request)
        self.assertEqual(response.status_code, 200)
        user_object = Users.objects.all().order_by("-id")[0]
        for key, value in json.loads(request_data["users"][0]).iteritems():
            self.assertEqual(user_object.name, value['data']['name'])

    def test_update_rooms(self):
        request_data = {
            "type": "rooms",
            "rooms": [
                u'{"3": {"data": {"department": "31Room", "spots": "31", "number": "51"}}}'
            ]
        }
        request = self.factory.post("/ajax/update/", request_data)
        response = ajax_update_view(request)
        self.assertEqual(response.status_code, 200)
        room_object = Rooms.objects.all().order_by("-id")[0]
        for key, value in json.loads(request_data["rooms"][0]).iteritems():
            self.assertEqual(room_object.department, value['data']['department'])