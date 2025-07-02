const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const accessToken = localStorage.getItem('access_token');
    const isLoginEndpoint = url.toLowerCase().startsWith('login/');
    console.log(`fetchWithAuth: URL=${url}, isLoginEndpoint=${isLoginEndpoint}, accessToken=${accessToken ? 'présent' : 'absent'}`);
  
    // Construire les en-têtes de base
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };
  
    // Ajouter l'en-tête Authorization uniquement si ce n'est pas l'endpoint login/ et qu'un token existe
    if (!isLoginEndpoint && accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
  
    console.log('En-têtes envoyés:', headers);
  
    // Vérifier si l'URL est complète (commence par http:// ou https://)
    const isFullUrl = url.startsWith('http://') || url.startsWith('https://');
    const finalUrl = isFullUrl ? url : `http://localhost:8000/api/${url}`;
    console.log(`URL finale: ${finalUrl}`); // Log pour vérifier l'URL utilisée
  
    return fetch(finalUrl, {
      ...options,
      headers,
    });
  };
  
  export default fetchWithAuth;