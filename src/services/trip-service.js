import { callExternalApi } from "./external-api-service";

const apiServerUrl = import.meta.env.VITE_BASE_API_URL;

export const getTrips = async (queryConfig) => {
    const url = !!queryConfig.user ? `${apiServerUrl}/trips/${queryConfig.user}` : `${apiServerUrl}/trips`;
    const config = {
        url: url,
        method: "GET",
        params: queryConfig.params,
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${queryConfig.token}`
        },
        data: queryConfig.data
      };
    
      return await callExternalApi({ config });
}

export const upsertTrip = async (queryConfig) => {
    const config = {
        url: `${apiServerUrl}/trip`,
        method: "POST",
        params: queryConfig.params,
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${queryConfig.token}`
        },
        data: queryConfig.data
      };
    
      return await callExternalApi({ config });
}

export const getTripById = async (queryConfig) => {
    const config = {
        url: `${apiServerUrl}/trip/${queryConfig.params.id}`,
        method: "GET",
        params: queryConfig.params,
        headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${queryConfig.token}`
        },
        data: queryConfig.data
    };
    return await callExternalApi({ config });
}

export const uploadTripCoverPhoto = async (queryConfig) => {
  const formData = new FormData();

  // "file" matches what your Azure Function is expecting
  formData.append("file", queryConfig.file);
  console.log(formData.get("file")); // Log the file to verify it's being appended correctly

  const config = {
    url: `${apiServerUrl}/trips/${queryConfig.tripId}/cover-photo`,
    method: "POST",
    params: queryConfig.params,
    headers: {
      Authorization: `Bearer ${queryConfig.token}`
      // DO NOT set content-type manually for FormData
    },
    data: formData
  };

  return await callExternalApi({ config });
};

export const upsertItineraryItem = async (queryConfig) => {
  const config = {
        url: `${apiServerUrl}/itineraryItem/${queryConfig.tripID}`,
        method: "POST",
        params: queryConfig.params,
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${queryConfig.token}`
        },
        data: queryConfig.data
      };
    
      return await callExternalApi({ config });
}

export const upsertToDo = async (queryConfig) => {
  const config = {
        url: `${apiServerUrl}/toDo/${queryConfig.tripID}`,
        method: "POST",
        params: queryConfig.params,
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${queryConfig.token}`
        },
        data: queryConfig.data
      };

    return await callExternalApi({ config }); 
  }

export const upsertLeg = async (queryConfig) => {
  const legIDSegment = queryConfig.legID ? `/${queryConfig.legID}` : "";

  const config = {
        url: `${apiServerUrl}/leg/${queryConfig.tripID}${legIDSegment}`,
        method: "POST",
        params: queryConfig.params,
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${queryConfig.token}`
        },
        data: queryConfig.data
      };

    return await callExternalApi({ config }); 
  }

  export const deleteItineraryItem = async (queryConfig) => {
  const config = {
        url: `${apiServerUrl}/itineraryItem/${queryConfig.tripID}/${queryConfig.itineraryItemID}`,
        method: "DELETE",
        params: queryConfig.params,
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${queryConfig.token}`
        },
        data: queryConfig.data
      };
    
      return await callExternalApi({ config });
}