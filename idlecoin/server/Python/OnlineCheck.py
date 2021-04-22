#!/usr/bin/python3
import time, pymongo
from pymongo import UpdateMany
from pymongo.errors import BulkWriteError

client = pymongo.MongoClient("mongodb://127.0.0.1:3001/meteor")
db = client.meteor.users

start_time = time.time()

while True:
    time_check = time.time() - 300
    requests = [
        UpdateMany(
            filter={"$and": [{"connected": "true"}, {"lastPinged": {"$lt": time_check}}]},
            update={"$set": {"connected": "false"}},
        )
    ]
    try:
        result = db.bulk_write(requests, ordered=False)
    except BulkWriteError as bwe:
        print(bwe.details)
    print(result.bulk_api_result)
    time.sleep(60 - ((time.time() - start_time) % 60))