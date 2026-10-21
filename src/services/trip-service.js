import { callExternalApi } from "./external-api-service";
import { supabase } from "@/lib/supabase";

const apiServerUrl = import.meta.env.VITE_BASE_API_URL;

const authHeaders = async () => {
  const { data } = await supabase.auth.getSession();
  if (!data.session?.access_token) throw new Error("You must sign in before accessing trips.");
  return { Authorization: `Bearer ${data.session.access_token}` };
};

export const getTrips = async (queryConfig) => {
    const authorization = await authHeaders();
    const url = !!queryConfig.user ? `${apiServerUrl}/trips/${queryConfig.user}` : `${apiServerUrl}/trips`;
    const config = {
        url: url,
        method: "GET",
        params: queryConfig.params,
        headers: {
          "content-type": "application/json",
          ...authorization
        },
        data: queryConfig.data
      };
    
      return await callExternalApi({ config });
}

export const upsertTrip = async (queryConfig) => {
    const authorization = await authHeaders();
    const config = {
        url: `${apiServerUrl}/trip`,
        method: "POST",
        params: queryConfig.params,
        headers: {
          "content-type": "application/json",
          ...authorization
        },
        data: queryConfig.data
      };
    
      return await callExternalApi({ config });
}

export const getTripById = async (queryConfig) => {
    const authorization = await authHeaders();
    const config = {
        url: `${apiServerUrl}/trip/${queryConfig.params.id}`,
        method: "GET",
        params: queryConfig.params,
        headers: {
            "content-type": "application/json",
            ...authorization
        },
        data: queryConfig.data
    };
    return await callExternalApi({ config });
}

export const deleteTrip = async (queryConfig) => {
  const authorization = await authHeaders();
  return await callExternalApi({
    config: {
      url: `${apiServerUrl}/trip/${queryConfig.params.id}`,
      method: "DELETE",
      headers: authorization,
    },
  });
}

export const uploadTripCoverPhoto = async (queryConfig) => {
  const authorization = await authHeaders();
  const formData = new FormData();

  // "file" matches what your Azure Function is expecting
  formData.append("file", queryConfig.file);
  console.log(formData.get("file")); // Log the file to verify it's being appended correctly

  const config = {
    url: `${apiServerUrl}/trips/${queryConfig.tripId}/cover-photo`,
    method: "POST",
    params: queryConfig.params,
    headers: {
      ...authorization
      // DO NOT set content-type manually for FormData
    },
    data: formData
  };

  return await callExternalApi({ config });
};

export const upsertItineraryItem = async (queryConfig) => {
  const authorization = await authHeaders();
  const config = {
        url: `${apiServerUrl}/itineraryItem/${queryConfig.tripID}`,
        method: "POST",
        params: queryConfig.params,
        headers: {
          "content-type": "application/json",
          ...authorization
        },
        data: queryConfig.data
      };
    
      return await callExternalApi({ config });
}

export const upsertToDo = async (queryConfig) => {
  const authorization = await authHeaders();
  const config = {
        url: `${apiServerUrl}/toDo/${queryConfig.tripID}`,
        method: "POST",
        params: queryConfig.params,
        headers: {
          "content-type": "application/json",
          ...authorization
        },
        data: queryConfig.data
      };

    return await callExternalApi({ config }); 
  }

export const upsertLeg = async (queryConfig) => {
  const authorization = await authHeaders();
  const legIDSegment = queryConfig.legID ? `/${queryConfig.legID}` : "";

  const config = {
        url: `${apiServerUrl}/leg/${queryConfig.tripID}${legIDSegment}`,
        method: "POST",
        params: queryConfig.params,
        headers: {
          "content-type": "application/json",
          ...authorization
        },
        data: queryConfig.data
      };

    return await callExternalApi({ config }); 
  }

  export const deleteItineraryItem = async (queryConfig) => {
  const authorization = await authHeaders();
  const config = {
        url: `${apiServerUrl}/itineraryItem/${queryConfig.tripID}/${queryConfig.itineraryItemID}`,
        method: "DELETE",
        params: queryConfig.params,
        headers: {
          "content-type": "application/json",
          ...authorization
        },
        data: queryConfig.data
      };
    
      return await callExternalApi({ config });
}
