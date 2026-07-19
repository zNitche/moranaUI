import { MoranaNavigationBar, useRouter, clsx } from "moranaui";
import classes from "./NavigationBar.module.css";
import { useMemo, type JSX } from "react";
import CollectionIcon from "@root/icons/CollectionIcon";
import HomeIcon from "@root/icons/HomeIcon";
import MenuIcon from "@root/icons/MenuIcon";

export default function NavigationBar() {
    const { navigateTo, router, getRouteUUIDByName } = useRouter();

    const menuEntries = useMemo(() => {
        const entries: {
            Icon: (props: React.SVGAttributes<SVGElement>) => JSX.Element;
            name: string;
            url: string;
        }[] = [
            {
                Icon: CollectionIcon,
                name: "collection",
                url: "/collection"
            },
            {
                Icon: HomeIcon,
                name: "home",
                url: "/"
            },
            {
                Icon: MenuIcon,
                name: "more-menu",
                url: "/more-menu"
            }
        ];

        return entries.map((e) => {
            const isActive =
                router.currentRoute?.uuid === getRouteUUIDByName(e.name);

            return (
                <div
                    key={e.name}
                    className={classes.navItem}
                    onClick={() => navigateTo({ path: e.url })}
                >
                    <e.Icon
                        className={clsx(
                            classes.navIcon,
                            isActive && classes.active,
                        )}
                    />
                </div>
            );
        });
    }, [getRouteUUIDByName, navigateTo, router.currentRoute?.uuid]);

    return (
        <MoranaNavigationBar className={classes.navigationBar}>
            {menuEntries}
        </MoranaNavigationBar>
    );
}
