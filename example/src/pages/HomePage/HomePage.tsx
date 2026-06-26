import {
    useRouter,
    MoranaPage,
    buildUrl,
    MoranaContent,
    MoranaHeader,
} from "moranaui";

export default function HomePage() {
    const { navigateTo } = useRouter();

    return (
        <MoranaPage>
            <MoranaHeader>
                <span>Home Page</span>
            </MoranaHeader>
            <MoranaContent>
                <div>
                    <div onClick={() => navigateTo("/about", false)}>
                        nav to about
                    </div>
                    <div
                        onClick={() =>
                            navigateTo(
                                buildUrl(
                                    "/test/idhere/param/where/qhere/pass",
                                    {
                                        q1: "param",
                                        q2: ["test", "1"],
                                    },
                                ),
                                true,
                            )
                        }
                    >
                        nav to params
                    </div>
                </div>
            </MoranaContent>
        </MoranaPage>
    );
}
