import * as chai from "chai";

import { setQueryParams } from "../src/url";

chai.should();

describe("setQueryParams", () => {
    it("doesn't destroy existing params", () => {
        const url = setQueryParams(
            "https://serenity.io/?captain=mreynolds",
            {
                cargo: "bobble-headed-geisha-dolls",
            },
        );

        url.should.equal("https://serenity.io/?captain=mreynolds&cargo=bobble-headed-geisha-dolls");
    });

    it("overrides same-named params", () => {
        const url = setQueryParams(
            "https://serenity.io/?cargo=none",
            {
                cargo: "bobble-headed-geisha-dolls",
            },
        );

        url.should.equal("https://serenity.io/?cargo=bobble-headed-geisha-dolls");
    });
});
