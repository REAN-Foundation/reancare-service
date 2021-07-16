

export default async () => {
    try {
        console.log("Tearing down...");
    }
    catch (error) {
        console.log('Problem in tearing down the tests! -> ' + error.message);
    }
};

