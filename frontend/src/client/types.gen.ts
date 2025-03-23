// This file is auto-generated by @hey-api/openapi-ts

export type Body_login_login_access_token = {
    grant_type?: (string | null);
    username: string;
    password: string;
    scope?: string;
    client_id?: (string | null);
    client_secret?: (string | null);
};

export type Body_recipes_generate_recipe = {
    user_input: string;
};

export type Body_recipes_improve_recipe = {
    user_input: string;
};

export type DirectionCreate = {
    index: number;
    content?: (string | null);
};

export type DirectionPublic = {
    index: number;
    content?: (string | null);
    id: string;
};

export type HTTPValidationError = {
    detail?: Array<ValidationError>;
};

export type IngredientCreate = {
    index: number;
    content?: (string | null);
};

export type IngredientPublic = {
    index: number;
    content?: (string | null);
    id: string;
};

export type Message = {
    message: string;
};

export type NewPassword = {
    token: string;
    new_password: string;
};

export type PrivateUserCreate = {
    email: string;
    password: string;
    full_name: string;
    is_verified?: boolean;
};

export type RecipeCreate = {
    title: string;
    description: string;
    preparation_time: number;
    cook_time?: (number | null);
    serves: number;
    is_favorite?: boolean;
    ingredients?: Array<IngredientCreate>;
    directions?: Array<DirectionCreate>;
};

export type RecipePublic = {
    title: string;
    description: string;
    preparation_time: number;
    cook_time?: (number | null);
    serves: number;
    is_favorite?: boolean;
    id: string;
    ingredients?: Array<IngredientPublic>;
    directions?: Array<DirectionPublic>;
};

export type RecipesPublic = {
    data: Array<RecipePublic>;
    count: number;
};

export type RecipeUpdate = {
    title?: (string | null);
    description?: (string | null);
    preparation_time?: (number | null);
    cook_time?: (number | null);
    serves?: (number | null);
    is_favorite?: (boolean | null);
    ingredients?: (Array<IngredientCreate> | null);
    directions?: (Array<DirectionCreate> | null);
};

export type Token = {
    access_token: string;
    token_type?: string;
};

export type UpdatePassword = {
    current_password: string;
    new_password: string;
};

export type UserCreate = {
    email: string;
    is_active?: boolean;
    is_superuser?: boolean;
    full_name?: (string | null);
    password: string;
};

export type UserPublic = {
    email: string;
    is_active?: boolean;
    is_superuser?: boolean;
    full_name?: (string | null);
    id: string;
};

export type UserRegister = {
    email: string;
    password: string;
    full_name?: (string | null);
};

export type UsersPublic = {
    data: Array<UserPublic>;
    count: number;
};

export type UserUpdate = {
    email?: (string | null);
    is_active?: boolean;
    is_superuser?: boolean;
    full_name?: (string | null);
    password?: (string | null);
};

export type UserUpdateMe = {
    full_name?: (string | null);
    email?: (string | null);
};

export type ValidationError = {
    loc: Array<(string | number)>;
    msg: string;
    type: string;
};

export type LoginLoginAccessTokenData = {
    formData: Body_login_login_access_token;
};

export type LoginLoginAccessTokenResponse = (Token);

export type LoginTestTokenResponse = (UserPublic);

export type LoginRecoverPasswordData = {
    email: string;
};

export type LoginRecoverPasswordResponse = (Message);

export type LoginResetPasswordData = {
    requestBody: NewPassword;
};

export type LoginResetPasswordResponse = (Message);

export type LoginRecoverPasswordHtmlContentData = {
    email: string;
};

export type LoginRecoverPasswordHtmlContentResponse = (string);

export type PrivateCreateUserData = {
    requestBody: PrivateUserCreate;
};

export type PrivateCreateUserResponse = (UserPublic);

export type RecipesReadRecipesData = {
    limit?: number;
    skip?: number;
};

export type RecipesReadRecipesResponse = (RecipesPublic);

export type RecipesCreateRecipeData = {
    requestBody: RecipeCreate;
};

export type RecipesCreateRecipeResponse = (RecipePublic);

export type RecipesReadRecipeData = {
    id: string;
};

export type RecipesReadRecipeResponse = (RecipePublic);

export type RecipesUpdateRecipeData = {
    id: string;
    requestBody: RecipeUpdate;
};

export type RecipesUpdateRecipeResponse = (RecipePublic);

export type RecipesDeleteRecipeData = {
    id: string;
};

export type RecipesDeleteRecipeResponse = (Message);

export type RecipesGenerateRecipeData = {
    requestBody: Body_recipes_generate_recipe;
};

export type RecipesGenerateRecipeResponse = (RecipePublic);

export type RecipesImproveRecipeData = {
    id: string;
    requestBody: Body_recipes_improve_recipe;
};

export type RecipesImproveRecipeResponse = (RecipePublic);

export type UsersReadUsersData = {
    limit?: number;
    skip?: number;
};

export type UsersReadUsersResponse = (UsersPublic);

export type UsersCreateUserData = {
    requestBody: UserCreate;
};

export type UsersCreateUserResponse = (UserPublic);

export type UsersReadUserMeResponse = (UserPublic);

export type UsersDeleteUserMeResponse = (Message);

export type UsersUpdateUserMeData = {
    requestBody: UserUpdateMe;
};

export type UsersUpdateUserMeResponse = (UserPublic);

export type UsersUpdatePasswordMeData = {
    requestBody: UpdatePassword;
};

export type UsersUpdatePasswordMeResponse = (Message);

export type UsersRegisterUserData = {
    requestBody: UserRegister;
};

export type UsersRegisterUserResponse = (UserPublic);

export type UsersReadUserByIdData = {
    userId: string;
};

export type UsersReadUserByIdResponse = (UserPublic);

export type UsersUpdateUserData = {
    requestBody: UserUpdate;
    userId: string;
};

export type UsersUpdateUserResponse = (UserPublic);

export type UsersDeleteUserData = {
    userId: string;
};

export type UsersDeleteUserResponse = (Message);

export type UtilsTestEmailData = {
    emailTo: string;
};

export type UtilsTestEmailResponse = (Message);

export type UtilsHealthCheckResponse = (boolean);