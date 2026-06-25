import {
    useRouter,
    usePathParams,
    useSearchParams,
    MoranaPage,
} from "moranaui";

export default function ParamsPage() {
    const { navigateTo } = useRouter();

    const pathParams = usePathParams<{ id: string; w: string; q: string }>();
    const searchParams = useSearchParams<{}>();

    console.log(pathParams);
    console.log(searchParams);

    return (
        <MoranaPage>
            <div>Params Page</div>
            <div onClick={() => navigateTo("/", false)}>nav to home</div>
        </MoranaPage>
    );
}
