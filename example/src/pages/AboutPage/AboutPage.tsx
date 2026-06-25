import { useRouter, MoranaPage } from "moranaui";

export default function AboutPage() {
    const { navigateTo } = useRouter();

    return (
        <MoranaPage>
            <div>
                <div>About Page</div>
                <div onClick={() => navigateTo("/", false)}>nav to home</div>
            </div>
        </MoranaPage>
    );
}
