import { render, screen } from "@testing-library/react";
import VehicleForm from "@/components/VehicleForm";

test("renders VehicleForm component", () => {
    render(<VehicleForm />);
    expect(screen.getByText("Vehicle Selector")).toBeInTheDocument();
});