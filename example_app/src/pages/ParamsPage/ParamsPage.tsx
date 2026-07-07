import {
    useRouter,
    usePathParams,
    useSearchParams,
    MoranaPage,
} from "moranaui";
import Content from "../../components/Content/Content";

export default function ParamsPage() {
    const { navigateTo } = useRouter();

    const pathParams = usePathParams<{ id: string; w: string; q: string }>();
    const searchParams = useSearchParams<{}>();

    console.log(pathParams);
    console.log(searchParams);

    return (
        <MoranaPage>
            <div>
                <div>Params Page</div>
            </div>
            <Content>
                <div onClick={() => navigateTo({ path: "/" })}>nav to home</div>
            </Content>
        </MoranaPage>
    );
}
