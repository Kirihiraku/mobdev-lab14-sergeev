export const registerUser = async (user) => {
    const req = await fetch("https://kitek.ktkv.dev/feedback/api/auth/register", {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const res = await req.json()
    return res
}