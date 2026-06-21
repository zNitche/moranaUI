import { useRouter } from "moranaui";

export default function AboutPage() {
    const { navigateTo } = useRouter();

    return (
        <div>
            <div>About Page</div>
            <div onClick={() => navigateTo("/")}>nav to home</div>
        </div>
    );
}
