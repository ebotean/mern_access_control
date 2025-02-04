print("Add MongoDB user");
db = db.getSiblingDB("admin");
db.createUser({
  user: "access_gateman",
  pwd: "haltOrDie",
  roles: [{ role: "readWrite", db: "admin" }],
  roles: [{ role: "readWrite", db: "access" }],
});
print("Finished adding admin");