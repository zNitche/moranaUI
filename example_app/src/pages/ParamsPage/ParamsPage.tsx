import {
    useRouter,
    usePathParams,
    useSearchParams,
    MoranaPage,
    MoranaContent,
    MoranaHeader,
} from "moranaui";
import Content from "../../components/Content/Content";
import Header from "../../components/Header/Header";

export default function ParamsPage() {
    const { navigateTo } = useRouter();

    const pathParams = usePathParams<{ id: string; w: string; q: string }>();
    const searchParams = useSearchParams<{}>();

    console.log(pathParams);
    console.log(searchParams);

    return (
        <MoranaPage>
            <MoranaHeader>
                <Header title="ParamsPage" />
            </MoranaHeader>
            <MoranaContent>
                <Content>
                    <div>
                        <div>Params Page</div>
                    </div>
                    <div onClick={() => navigateTo({ path: "/" })}>
                        nav to home
                    </div>
                </Content>
            </MoranaContent>
        </MoranaPage>
    );
}
