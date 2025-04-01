export const filterDisplayConstants = {
	FAVORITE: "favorite",
	ALL: "all",
};

export const ROOTURL = "http://localhost:8000/api/v1/";

const backendRoutes = {
	emailVisit: ROOTURL + "email-visit/",
	register: ROOTURL + "auth/users/",
	login: ROOTURL + "auth/jwt/create/",
	activate: ROOTURL + "auth/users/activation/",
	verifyToken: ROOTURL + "auth/jwt/verify/",
};

export default backendRoutes;

export const TEMP_RECIPE_LOCAL_STORAGE_NAME = "temp-recipe";
