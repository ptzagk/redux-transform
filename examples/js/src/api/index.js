// simulates a network request
export function getAccountCap(): Promise<number> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(100000);
        }, 100);
    });
}
