//////////////////////
/// FETCH API DATA ///
//////////////////////

async function fetchApi(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('There was a problem fetching the data:', error);
    }
}

//////////////////////
///                ///
//////////////////////



//////////////////////
/// FETCH CSV DATA ///
//////////////////////

async function fetchCsv(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.text();
    } catch (error) {
        console.error('There was a problem fetching the data:', error);
    }
}

//////////////////////
///                ///
//////////////////////