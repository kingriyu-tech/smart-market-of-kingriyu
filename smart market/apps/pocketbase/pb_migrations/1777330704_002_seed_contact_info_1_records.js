/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("contact_info");

  const record0 = new Record(collection);
    record0.set("phone", "+1-000-0000");
    record0.set("email", "contact@example.com");
    record0.set("address", "Not provided");
    record0.set("business_hours", "Not provided");
    record0.set("additional_info", "Not provided");
  try {
    app.save(record0);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }
}, (app) => {
  // Rollback: record IDs not known, manual cleanup needed
})