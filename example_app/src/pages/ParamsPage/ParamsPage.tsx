import {
    useRouter,
    usePathParams,
    useSearchParams,
    MoranaPage,
    MoranaContent,
    MoranaHeader,
    useMoranaApp,
    useMoranaPageExit,
    useMoranaPageEnter,
} from "moranaui";
import Content from "@root/components/Content/Content";
import Header from "@root/components/Header/Header";

export default function ParamsPage() {
    const { setIsNavbarVisible } = useMoranaApp();
    const { navigateTo } = useRouter();

    useMoranaPageEnter({ callback: () => setIsNavbarVisible?.(false) });
    useMoranaPageExit({ callback: () => setIsNavbarVisible?.(true) });

    const pathParams = usePathParams<{ id: string; w: string; q: string }>();
    const searchParams = useSearchParams<unknown>();

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
