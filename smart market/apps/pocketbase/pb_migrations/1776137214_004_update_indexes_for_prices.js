/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("prices");
  collection.indexes.push("CREATE INDEX idx_prices_vegetable_id ON prices (vegetable_id)");
  collection.indexes.push("CREATE INDEX idx_prices_date ON prices (date)");
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("prices");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_prices_vegetable_id"));
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_prices_date"));
  return app.save(collection);
})