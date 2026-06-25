import { useRouter, MoranaPage } from "moranaui";

export default function HomePage() {
    const { navigateTo } = useRouter();

    return (
        <MoranaPage>
            <div>
                <div>
                    <span>Home Page</span>
                </div>
                <div onClick={() => navigateTo("/about", false)}>
                    nav to about
                </div>
            </div>
        </MoranaPage>
    );
}
