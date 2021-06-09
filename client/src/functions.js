// client/src/function.js
export async function fetchAttractions() {

    try {

        const response = await fetch("api/attractions");

        if (!response.ok) {
            const message = `An error has occured: ${response.status}`;
            throw new Error(message);
        }

        const attractions = await response.json();
        return attractions;


    } catch(error) {
        console.log("something went wrong when fetching attractions: ", error);
    }

}
