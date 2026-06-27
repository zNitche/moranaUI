import { useRouter, MoranaPage } from "moranaui";
import Header from "../../components/Header/Header";
import Content from "../../components/Content/Content";

export default function AboutPage() {
    const { navigateTo } = useRouter();

    return (
        <MoranaPage>
            <Header>
                <div>About Page</div>
            </Header>
            <Content>
                <div>
                    <div onClick={() => navigateTo("/", false)}>
                        nav to home
                    </div>
                </div>
            </Content>
        </MoranaPage>
    );
}
