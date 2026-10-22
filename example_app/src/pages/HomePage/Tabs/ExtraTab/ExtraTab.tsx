import { range } from "moranaui";

export default function ExtraTab() {
    return (
        <div>
            {range(20).map(
                () =>
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            ).join(" ")}
        </div>
    );
}
