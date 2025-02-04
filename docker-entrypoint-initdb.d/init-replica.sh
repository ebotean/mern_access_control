#!/bin/bash

echo ====================================================
echo ============= Initializing Replica Set =============
echo ====================================================

# Loop until MongoDB is ready to accept connections
until mongosh --host mongo:27017 --eval 'quit(0)' &>/dev/null; do
    echo "Waiting for mongod to start..."
    sleep 5
done

echo "MongoDB started. Initiating Replica Set..."

# Connect to the MongoDB service and initiate the replica set
mongosh --host mongo:27017 -u root -p example --authenticationDatabase admin <<EOF
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "localhost:27017" }
  ]
})
EOF

echo ====================================================
echo ============= Replica Set initialized ==============
echo ====================================================