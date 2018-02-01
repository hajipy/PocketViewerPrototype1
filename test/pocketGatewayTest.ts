import test from "ava";

import PocketGateway from "../src/main/gateway/PocketGateway";

test("PocketGateway::retrieve", async (t) => {
    const gateway = new PocketGateway();

    const articles = await gateway.retrieve();
    t.is(0, articles.length);
});