import { MODELS } from "@/lib/vehicleData";

test("Tesla should have Model 3", () => {
    expect(Object.keys(MODELS.tesla)).toContain("Model 3");
})