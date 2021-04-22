#!/usr/bin/python3
import time, pymongo
from pymongo import UpdateMany
from pymongo.errors import BulkWriteError


client = pymongo.MongoClient("mongodb://127.0.0.1:3001/meteor")
db = client.meteor.users

start_time = time.time()

difficulty = client.meteor.difficulty.find_one({"current": "difficulty"})["difficulty"]

while True:
    requests = [
        UpdateMany(
            filter={"connected": "true"},
            update=[{"$set": {"coinBalance": {"$add": ["$coinBalance", \
        {"$trunc" : [{"$divide": ["$processingPower", difficulty]}, 6 ]} ]} }}],
        )
    ]
    try:
        result = db.bulk_write(requests, ordered=False)
    except BulkWriteError as bwe:
        print(bwe.details)
    print(result.bulk_api_result)
    time.sleep(1 - ((time.time() - start_time) % 1))