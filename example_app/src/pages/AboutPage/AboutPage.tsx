import {
    useRouter,
    useMoranaPageEnter,
    useMoranaPageExit,
    MoranaPage,
    useIsPageActive,
    MoranaHeader,
    MoranaContent,
    MoranaModal,
    MoranaFullScreenOverlay,
    MoranaDrawer,
} from "moranaui";
import Header from "@root/components/Header/Header";
import Content from "@root/components/Content/Content";
import { useState } from "react";

export default function AboutPage() {
    const { navigateTo } = useRouter();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const isPageActive = useIsPageActive();

    console.log(`is about active: ${isPageActive}`);

    useMoranaPageEnter({ callback: () => console.log("about page enter") });
    useMoranaPageExit({ callback: () => console.log("about page exit") });

    return (
        <MoranaPage>
            <MoranaHeader>
                <Header title="About" />
            </MoranaHeader>
            <MoranaContent>
                <Content>
                    <div>
                        <div
                            onClick={() =>
                                navigateTo({ path: "/", direction: "back" })
                            }
                        >
                            nav to home
                        </div>
                        <div
                            onClick={() =>
                                setIsModalOpen((current) => !current)
                            }
                        >
                            toggle modal
                        </div>
                        <div
                            onClick={() =>
                                setIsOverlayOpen((current) => !current)
                            }
                        >
                            toggle overlay
                        </div>
                        <div
                            onClick={() =>
                                setIsDrawerOpen((current) => !current)
                            }
                        >
                            toggle drawer
                        </div>
                    </div>
                </Content>
            </MoranaContent>

            <MoranaFullScreenOverlay
                isOpen={isOverlayOpen}
                setIsOpen={setIsOverlayOpen}
            >
                test overlay
            </MoranaFullScreenOverlay>

            <MoranaModal
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
            >
                test modal
            </MoranaModal>

            <MoranaDrawer
                isOpen={isDrawerOpen}
                setIsOpen={setIsDrawerOpen}
            >
                test drawer
            </MoranaDrawer>
        </MoranaPage>
    );
}
