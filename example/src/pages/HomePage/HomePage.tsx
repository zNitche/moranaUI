import { useRouter, MoranaTest } from "moranaui";

export default function HomePage() {
    const { navigateTo } = useRouter();

    return (
        <div>
            <div>
                <span>Home Page</span>
                <MoranaTest text={"home"} />
            </div>
            <div onClick={() => navigateTo("/about")}>nav to about</div>
        </div>
    );
}
