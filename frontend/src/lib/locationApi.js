// GET CURRENT LATTITUDE & LOGITUDE
export const getCurrentLocation = async () => {
    return new Promise((resolve, reject) => {
        if(!navigator.geolocation)
            reject(new Error("Geolocation is not support by your browser"));

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                })
            },
            (error) => {
                reject(new Error ("Unable to retrive location: ",error));
            }
        )
    });

};
