import { useRouter } from "moranaui"

export default function HomePage() {
    const {navigateTo} = useRouter();

    return <div>
        <div>Home Page</div>
        <div onClick={() => navigateTo("/about")}>nav to about</div>
    </div>
}