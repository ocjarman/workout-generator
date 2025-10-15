#!/bin/bash

echo "🧪 Testing API Randomization"
echo "============================="
echo ""

echo "Testing Monday workouts (3 API calls):"
echo "--------------------------------------"
for i in 1 2 3; do
  response=$(curl -s http://localhost:3000/api/workouts/monday)
  id=$(echo $response | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
  first_exercise=$(echo $response | grep -o '"name":"[^"]*' | head -1 | cut -d'"' -f4)
  echo "Call $i: Workout ID $id - First exercise: $first_exercise"
  sleep 0.5
done

echo ""
echo "Testing /api/workouts endpoint (fetching full week 3 times):"
echo "-----------------------------------------------------------"
for i in 1 2 3; do
  echo -n "Fetch $i - Monday ID: "
  curl -s http://localhost:3000/api/workouts | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2
  sleep 0.5
done

echo ""
echo "✅ Test complete! If you see different IDs above, randomization is working!"

