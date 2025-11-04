<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# AedionAI Server

A progressive Node.js framework for building efficient and scalable server-side applications.

## Project Setup

```bash
# Install dependencies
$ npm install
```

## Running the App

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Running Tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

---

## GraphQL API Documentation

This section provides a comprehensive guide to the GraphQL API endpoints.

# **GraphQL Playground URL:**

`https://sehembz-travel-backend.onrender.com/graphql`

**Authentication:** For protected endpoints, you must include an `Authorization` header with the Bearer token.

```json
{
  "Authorization": "Bearer <YOUR_ACCESS_TOKEN>"
}
```

### 1. Authentication & User Management

<details>
<summary><strong>Sign Up </strong></summary>

**Mutation**

```graphql
mutation signup($data: CreateUserInput!) {
  signUp(data: $data) {
    message
    user {
      firstName
      email
    }
  }
}
```

**Variables**

```json
{
  "data": {
    "email": "example@gmail.com",
    "password": "Userpassword1234",
    "firstName": "<NAME>"
  }
}
```

</details>

<details>
<summary><strong>Login</strong></summary>

**Mutation**

```graphql
mutation Login($data: LoginUserInput!) {
  login(data: $data) {
    accessToken
    user {
      id
      email
      firstName
    }
  }
}
```

**Variables**

```json
{
  "data": {
    "email": "user@example.com",
    "password": "strongPassword123"
  }
}
```

</details>

<details>
<summary><strong>Request Password Reset</strong></summary>

**Mutation**

```graphql
mutation RequestPasswordReset($data: RequestPasswordResetInput!) {
  requestPasswordReset(data: $data) {
    message
    resetLink
  }
}
```

**Variables**

```json
{
  "data": {
    "email": "user@example.com"
  }
}
```

</details>

<details>
<summary><strong>Reset Password</strong></summary>

**Mutation**

```graphql
mutation ResetPassword($data: ResetPasswordInput!) {
  resetPassword(data: $data) {
    message
  }
}
```

**Variables**

```json
{
  "data": {
    "token": "",
    "newPassword": "",
    "confirmNewPassword": ""
  }
}
```

</details>

<details>
<summary><strong>Change Password</strong></summary>

**Mutation**

```graphql
mutation ChangePassword($userId: String!, $data: ChangePasswordInput!) {
  changePassword(userId: $userId, data: $data) {
    message
  }
}
```

**Variables**

```json
{
  "userId": "12c18e30-24a7-4709-8898-56783b5474d8",
  "data": {
    "currentPassword": "Test1234",
    "newPassword": "User1234",
    "confirmNewPassword": "User1234"
  }
}
```

</details>

<details>
<summary><strong>Update Personal Info</strong></summary>

**Mutation**

```graphql
mutation UpdatePersonalInfo($userId: String!, $data: UpdatePersonalInfoInput!) {
  updatePersonalInfo(userId: $userId, data: $data) {
    message
    user {
      id
      firstName
      lastName
    }
  }
}
```
**Variables**

```json
{
  "userId": "<USER_ID>",
  "data": {
    "firstName": "",
    "lastName": ""
  }
}
```
</details>


<details>
<summary><strong>Fetch Current User</strong></summary>

**Query**

```graphql
query getCurrentUser{
  getCurrentUser {
    id
    email
    firstName
    lastName
  }
}
```
</details>

## 2. Blog Section

<details>
<summary><strong> Create Blog Tag</strong></summary>

**query**

```graphql
mutation CreateBlogTag($data: CreateBlogTagInput!) {
  createBlogTag(data: $data) {
    id
    name
    createdAt
    updatedAt
  }
}
```

**variable**

```json
{
  "data": {
    "name": "Food"
  }
}
```

</details>

<details>
<summary><strong> Update Blog Tag</strong></summary>

**query**

```graphql
mutation EditBlogTag($id: String!, $data: EditBlogTagInput!) {
  editBlogTag(id: $id, data: $data) {
    id
    name
    createdAt
    updatedAt
  }
}
```

**variable**

```json
{
  "id": "59417c76-af85-4ef1-996d-35e38b56c415",
  "data": {
    "name": "Travel & Adventure"
  }
}
```

</details>

<details>
<summary><strong> Fetch all Blog Tag</strong></summary>

**query**

```graphql
query GetAllBlogTags {
  getAllBlogTags {
    id
    name
    createdAt
    updatedAt
  }
}
```

</details>

<details>
<summary><strong> Delete Blog Tag</strong></summary>

**query**

```graphql
mutation DeleteBlogTag($id: String!) {
  deleteBlogTag(id: $id)
}
```

**variable**

```json
{
  "id": "59417c76-af85-4ef1-996d-35e38b56c415"
}
```

</details>

<details>
<summary><strong> Create Blog</strong></summary>

Set status to DRAFT if you want to save as draft and to PUBLISHED if you want to publish directly after creating

**query**

```graphql
mutation CreateBlog($data: CreateBlogInput!) {
  createBlog(data: $data) {
    message
    blog {
      id
      title
      content
      coverMedia
      status
      highlighted
      archived
      tag {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
}
```

**variable**

status should be set as DRAFT if you want to save as draft and as PUBLISHED if you want to publish directly

```json
{
  "data": {
    "title": " ",
    "content": "",
    "coverMedia": "<image url>",
    "tagId": "<TAG ID>",
    "status": "DRAFT"
  }
}
```

</details>

<details>
<summary><strong> Edit Blog</strong></summary>

**query**

```graphql
mutation EditBlog($id: String!, $data: EditBlogInput!) {
  editBlog(id: $id, data: $data) {
    message
    blog {
      id
      title
      content
      status
      coverMedia
      tag {
        id
        name
      }
      updatedAt
    }
  }
}
```

**variable**

status should be set as DRAFT if you want to save as draft and as PUBLISHED if you want to publish directly

```json
{
  "id": "<BLOG ID>",
  "data": {
    "title": "",
    "content": "",
    "status": "",
    "coverMedia": "",
    "tagId": ""
  }
}
```

</details>

<details>
<summary><strong> Update Blog Status</strong></summary>

**query**

```graphql
mutation UpdateBlogStatus($id: String!, $status: Status!) {
  updateBlogStatus(id: $id, status: $status) {
    message
    blog {
      id
      title
      status
      archived
      highlighted
      datePublished
    }
  }
}
```

**variable**

```json
{
  "id": "<BLOG ID>",
  "status": ""
}
```

```enum
(enum) Status
  DRAFT
  PUBLISHED
  ARCHIVED
  HIGHLIGHTED

```

</details>

<details>
<summary><strong> Delete a Blog</strong></summary>

**query**

```graphql
mutation DeleteBlog($id: String!) {
  deleteBlog(id: $id)
}
```

**variable**

```json
{
  "id": "9d58909b-240f-4177-8eab-b46435da6f90"
}
```

</details>

<details>
<summary><strong> Fetch One Blog Details</strong></summary>

**query**

```graphql
query GetOneBlog($id: String!) {
  getOneBlog(id: $id) {
    id
    title
    content
    status
    tag {
      id
      name
    }
  }
}
```

**variable**

```json
{
  "id": "9d58909b-240f-4177-8eab-b46435da6f90"
}
```

</details>

<details>
<summary><strong> Get All Published Blogs</strong></summary>

**query**

```graphql
query GetAllPublishedBlogs {
  getAllPublishedBlogs {
    id
    title
    status
    coverMedia
    content
    tag {
      id
      name
    }
  }
}
```

</details>

<details>
<summary><strong> Get Highlighted Blog</strong></summary>

**query**

```graphql
query GetHighlightedBlog {
  getHighlightedBlog {
    id
    title
    status
    highlighted
    tag {
      id
      name
    }
  }
}
```

</details>

<details>
<summary><strong> Get All Blogs(filters and pagination)</strong></summary>

**query**

```graphql
query GetAllBlogs($filter: BlogFilterInput) {
  getAllBlogs(filter: $filter) {
    data {
      id
      title
      status
      datePublished
      tag {
        id
        name
      }
    }
    total
    page
    pageSize
  }
}
```

**variable for Differet scenerio**

filter by status

```json
{
  "filter": {
    "status": "ARCHIVED"
  }
}
```

filter by tag

```json
{
  "filter": {
    "tagId": "982f2cc9-15f2-4340-be68-b21034761152"
  }
}
```

filter by pre-defined dates

```json
{
  "filter": {
    "dateRangePreset": "last_7_days"
  }
}

other predefined dates
"today"
"last_14_days"
"month_to_date"
"last_3_months"
"last_12_months"
"year_to_date"
```

filter by a start date and end date the user will choose. set date range to be "custom" then provide the selected dates.

```json
{
  "filter": {
    "dateRangePreset": "custom",
    "startDate": "2025-10-01T00:00:00Z",
    "endDate": "2025-10-30T23:59:59Z"
  }
}
```

no chose filter, just paginated results of all data

```json
{
  "filter": {
    "page": 2,
    "pageSize": 5
  }
}
```

</details>

<details>
<summary><strong> Search Blogs by title (auto suggests based on user input)</strong></summary>

**query**

```graphql
query SearchBlogs($title: String!) {
  searchBlogs(title: $title) {
    id
    title
    status
    tag {
      id
      name
    }
  }
}
```

**variable**

```json
{
  "title": "<User Input>"
}
```

</details>

## 3. Tour Package

<details>
<summary><strong> Add Tour Type </strong></summary>

**query**

```graphql
mutation createTourType($data: CreateTourTypeInput!) {
  createTourType(data: $data) {
    id
    name
    createdAt
  }
}
```

**variable**

```json
{
  "data": {
    "name": "<TOUR-TYPE-NAME>"
  }
}
```

</details>

<details>
<summary><strong> Update Tour Type </strong></summary>

**query**

```graphql
mutation updateTourType($id: String!, $data: EditTourTypeInput!) {
  editTourType(id: $id, data: $data) {
    id
    name
  }
}
```

**variable**

```json
{
  "id": "<TOUR-TYPE-ID>",
  "data": {
    "name": "<NAME TO UPDATE TO>"
  }
}
```

</details>

<details>
<summary><strong> Fetch all Tour Type </strong></summary>

**query**

```graphql
query {
  getAllTourTypes {
    id
    name
    createdAt
  }
}
```

</details>

<details>
<summary><strong> Delete Tour Type </strong></summary>

**query**

```graphql
mutation deleteTourType($id: String!) {
  deleteTourType(id: $id)
}
```

**variable**

```json
{
  "id": "<TOUR-TYPE-ID>"
}
```

</details>

<details>
<summary><strong> Create Tour Package </strong></summary>

**query**

```graphql
mutation CreateTourPackage($data: CreateTourPackageInput!) {
  createTourPackage(data: $data) {
    message
    tour {
      id
      tourTitle
      location
      status
      minimumPrice
      duration
      coverMedia
      tourType {
        id
        name
      }
      clientPriceOptions {
        id
        categoryName
        price
      }
    }
  }
}
```

**variable**

```json
{
  "data": {
    "tourTitle": "",
    "location": "",
    "minimumPrice": 1500.50,
    "tourTypeId": "<TOUR-TYPEID>",
    "status": "DRAFT",
    "highlighted": false,
    "coverMedia": [
      "<IMAGE URL 1>",
      "<IMAGE URL 2>"
    ],
    "departureDate": "2026-02-15T00:00:00Z",
    "returnDate": "2026-02-25T00:00:00Z",
    "description": "",
    "activities": "",
    "priceOptions": [
      {
        "categoryName": "",
        "price": 1500.50
      },
      {
        "categoryName": "",
        "price": 750.25
      }
    ]
  }
}

Set status to DRAFT if you want to save as draft and to PUBLISHED if you want to publish directly after creating.

```

</details>

<details>
<summary><strong> Edit Tour Package </strong></summary>

**query**

```graphql
mutation EditTourPackage($id: String!, $data: EditTourPackageInput!) {
  editTourPackage(id: $id, data: $data) {
    message
    tour {
      id
      tourTitle
      location
      status
      updatedAt
      tourType {
        id
        name
      }
    }
  }
}
```

**variable**

```json
{
  "tourId": "TOUR_ID_HERE",
  "input": {
    "tourTitle": "The Magical Mediterranean Cruise (Updated)",
    "location": "Europe and North Africa",
    "minimumPrice": 1250.00,
    "status": "DRAFT",

    "departureDate": "2026-06-15T00:00:00Z",
    "returnDate": "2026-06-25T00:00:00Z",

    "coverMedia": [
      "https://example.com/new_image_1.jpg",
      "https://example.com/new_image_2.jpg"
    ],

    "description": null,
    "activities": "Updated list of activities after review.",

    "highlighted": true,

    "priceOptionsToUpsert": [
      {
        "id": "EXISTING_PRICE_ID_TO_UPDATE",
        "categoryName": "Premium Client Tier",
        "price": 2500.00
      },
      {
        "categoryName": "Budget Traveler",
        "price": 999.00
      }
    ],
    "priceOptionIdsToDelete": [
      "EXISTING_PRICE_ID_TO_DELETE_1",
      "EXISTING_PRICE_ID_TO_DELETE_2"
    ]
  }
}

Set status to DRAFT if you want to save as draft and to PUBLISHED if you want to publish directly after creating.

```

</details>

<details>
<summary><strong> Update Tour Package Status </strong></summary>

**query**

```graphql
mutation UpdateTourPackageStatus($id: String!, $status: Status!) {
  updateTourPackageStatus(id: $id, status: $status) {
    message
    tour {
      id
      tourTitle
      status
      archived
      highlighted
      datePublished
      createdAt
      updatedAt
    }
  }
}
```

**variable**

```json
{
  "id": "12efab79-9da7-47ac-aeb5-1e990f45825d",
  "status": "PUBLISHED"
}
```

</details>

<details>
<summary><strong> Delete Package </strong></summary>
same endpoint is used for unpin

**query**

```graphql
mutation DeleteTourPackage($id: String!) {
  deleteTourPackage(id: $id)
}
```

**variable**

```json
{
  "id": "<TOUR PACKAGE ID>"
}
```

</details>

<details>
<summary><strong> Get Highlighted Package </strong></summary>

**query**

```graphql
query GetHighlightedTourPackage {
  getHighlightedTourPackage {
    id
    tourTitle
    location
    highlighted
    status
  }
}
```

</details>

<details>
<summary><strong> Get One Tour Package Details </strong></summary>

**query**

```graphql
query GetOneTourPackage($id: String!) {
  getOneTourPackage(id: $id) {
    id
    tourTitle
    location
    description
    activities
    status
    coverMedia
    clientPriceOptions {
      id
      categoryName
      price
    }
  }
}
```

**variable**

```json
{
  "id": "<TOUR PACKAGE ID>"
}
```

</details>

<details>
<summary><strong> Get all Published Tour Packages </strong></summary>

**query**

```graphql
query GetAllPublishedTours {
  getAllPublishedTours {
    id
    tourTitle
    location
    status
    coverMedia
    tourType {
      id
      name
    }
  }
}
```

</details>

<details>
<summary><strong> Get All Tour Packages (filter and pagination) </strong></summary>

**query**

```graphql
query GetAllTours($filter: TourFilterInput) {
  getAllTours(filter: $filter) {
    data {
      id
      tourTitle
      location
      status
      tourType {
        id
        name
      }
    }
    total
    page
    pageSize
  }
}
```

**variable for different filter cases**

no filter

```json
{
  "filter": {}
}
```

filter by status

```json
{
  "filter": {
    "status": "PUBLISHED"
  }
}
```

filter by location

```json
{
  "filter": {
    "location": "Kenya"
  }
}
```

Filter by tour type

```json
{
  "filter": {
    "tourTypeId": "6db7ec6a-390d-46f9-bd6f-89484b84de13"
  }
}
```

Filter by date range

```json
{
  "filter": {
    "startDate": "2025-01-01T00:00:00Z",
    "endDate": "2025-10-14T23:59:59Z",
    "page": 2
  }
}
```

</details>

<details>
<summary><strong> Search Tour Package By Title </strong></summary>

**query**

```graphql
query searchTours($title: String!) {
  searchTours(title: $title) {
    id
    tourTitle
    location
  }
}
```

**variable**

```json
{
  "title": "<User Input>"
}
```

</details>

## 4. Destination Travel

<details>
<summary><strong>Create Destination </strong></summary>

**query**

```graphql
mutation CreateDestinationTravel($data: CreateDestinationTravelInput!) {
  createDestinationTravel(data: $data) {
    message
    destination {
      id
      tourTitle
      location
      status
      duration
      coverMedia
      clientPriceOptions {
        id
        categoryName
        price
      }
    }
  }
}
```

**variable**

Set status to DRAFT if you want to save as draft and to PUBLISHED if you want to publish directly after creating

```json
{
  "data": {
    "tourTitle": "",
    "location": " ",
    "departureDate": "2026-04-10T00:00:00Z",
    "returnDate": "2026-04-17T00:00:00Z",
    "description": "",
    "activities": "Sightseeing, Wine Tasting, Art Tours",
    "status": " ",
    "coverMedia": ["<IMGE URL>g", "<IMAGE URL>"],
    "priceOptions": [
      {
        "categoryName": " ",
        "price": 1800
      },
      {
        "categoryName": " ",
        "price": 3200
      }
    ]
  }
}
```

</details>

<details>
<summary><strong>Edit Destination Travel </strong></summary>

**query**

```graphql
mutation editDestinationTravel($id: ID!, $input: EditDestinationTravelInput!) {
  editDestination(id: $id, data: $input) {
    message
    destination {
      id
      tourTitle
      status
      datePublished
      coverMedia
      departureDate
      returnDate
      description
      activities
      clientPriceOptions {
        id
        categoryName
        price
      }
    }
  }
}
```

**variable**

Set status to DRAFT if you want to save as draft and to PUBLISHED if you want to publish directly after creating

```json
{
  "id": "DESTINATION_ID_TO_EDIT",
  "input": {
    "tourTitle": "",
    "location": "",
    "minimumPrice": 3500.5,

    "status": "PUBLISHED",

    "departureDate": "2024-10-20T00:00:00Z",
    "returnDate": "2024-10-27T00:00:00Z",

    "coverMedia": [
      "https://storage.example.com/swiss_peak_1.jpg",
      "https://storage.example.com/swiss_peak_2.jpg"
    ],

    "description": null,
    "activities": "Hiking, Skiing, Cheese Tasting, Glacier Express ride.",

    "highlighted": true,

    "priceOptionsToUpsert": [
      {
        // UPDATE EXISTING OPTION (ID provided)
        "id": "EXISTING_PRICE_OPTION_ID_1",
        "categoryName": "Standard Package - Updated Price",
        "price": 3600.0
      },
      {
        // CREATE NEW OPTION (ID omitted)
        "categoryName": "Luxury Upgrade Tier",
        "price": 5800.0
      }
    ],

    "priceOptionIdsToDelete": [
      "EXISTING_PRICE_OPTION_ID_TO_DELETE_2",
      "EXISTING_PRICE_OPTION_ID_TO_DELETE_3"
    ]
  }
}
```

</details>

<details>
<summary><strong> Update Destination Travel Status </strong></summary>

**query**

```graphql
mutation UpdateDestinationTravelStatus($id: String!, $status: Status!) {
  updateDestinationTravelStatus(id: $id, status: $status) {
    message
    destination {
      id
      tourTitle
      location
      status
      duration
      coverMedia
      clientPriceOptions {
        id
        categoryName
        price
      }
    }
  }
}
```

**variable**

```json
{
  "id": "4dfd3733-ecc4-41a1-8401-5144d5f67a69",
  "status": "HIGHLIGHTED"
}
```

</details>

<details>
<summary><strong>Delete Destination Travel </strong></summary>

**query**

```graphql
mutation DeleteDestinationTravel($id: ID!) {
  deleteDestinationTravel(id: $id) {
    message
  }
}
```

**variable**

```json
{
  "id": "DESTINATION_ID"
}
```

</details>

<details>
<summary><strong>Search Destination </strong></summary>

**query**

```graphql
query SearchDestinationTitles($title: String!) {
  searchTourTitles(title: $title) {
    id
    tourTitle
    location
    status
    highlighted
  }
}
```

**variable**

```json
{
  "title": " "
}
```

</details>

<details>
<summary><strong>fetch one Destination </strong></summary>

**query**

```graphql
query GetDestinationTravel($id: ID!) {
  getDestinationTravel(id: $id) {
    id
    tourTitle
    location
    description
    activities
    status
    highlighted
    archived
    coverMedia
    clientPriceOptions {
      id
      categoryName
      price
    }
  }
}
```

**variable**

```json
{
  "id": " "
}
```

</details>

<details>
<summary><strong>fetch all Destination(filter and pagination) </strong></summary>

**query**

```graphql
query GetAllDestinationTravels($filter: DestinationFilterInput) {
  getAllDestinationTravels(filter: $filter) {
    total
    page
    pageSize
    data {
      id
      tourTitle
      location
      status
      highlighted
      archived
      createdAt
      datePublished
    }
  }
}
```

**variable**

no filter

```json
{
  "id": " "
}
```

filter by status

```json
{
  "filter": {
    "status": "PUBLISHED"
  }
}
```

Filter by Location

```json
{
  "filter": {
    "location": "Paris"
  }
}
```

Filter by Date Range (Custom)

````json
{
  "filter": {
    "startDate": "2025-01-01T00:00:00Z",
    "endDate": "2025-10-14T23:59:59Z",
    "page": 2
  }
}
Filter by preset dates
```json
{
  "filter": {
    "dateRangePreset": "last_14_days"
  }
}

````

</details>

<details>
<summary><strong>fetch all Published Destination </strong></summary>

**query**

```graphql
query GetAllPublishedDestinations {
  getAllPublishedDestinations {
    id
    tourTitle
    location
    status
    highlighted
    archived
  }
}
```

</details>

<details>
<summary><strong>fetch Highlighted Destination </strong></summary>

**query**

```graphql
query GetHighlightedDestination {
  getHighlightedDestination {
    id
    tourTitle
    location
    status
    highlighted
  }
}
```

</details>

## 5. Visa Checklist

<details>
<summary><strong>Add Visa Checklist </strong></summary>

**query**

```graphql
mutation CreateVisaChecklist($data: CreateVisaChecklistInput!) {
  createVisaChecklist(data: $data) {
    message
    checklist {
      id
      country
      location
      description
      status
      images
      highlighted
      archived
      datePublished
      visaPriceOptions {
        id
        durationInDays
        price
      }
    }
  }
}
```

**variable**

```json
{
  "data": {
    "country": "",
    "location": " ",
    "description": " ",
    "status": " ",
    "images": ["< ARRAY OF IMAGES>"],
    "visaPriceOptions": [
      { "durationInDays": 30, "price": 150.0 },
      { "durationInDays": 90, "price": 300.0 }
    ]
  }
}
```

</details>

<details>
<summary><strong>Edit Visa Checklist </strong></summary>

**query**

```graphql
mutation editVisaChecklist($id: ID!, $input: EditVisaChecklistInput!) {
  editVisaChecklist(id: $id, data: $input) {
    message
    checklist {
      id
      country
      status
      datePublished
      images
      description
      highlighted
      visaPriceOptions {
        id
        durationInDays
        price
      }
    }
  }
}
```

**variable**

```json
{
  "id": "VISA_CHECKLIST_ID_TO_EDIT",
  "input": {
    "country": "",
    "location": "",
    "status": "",

    "images": ["image 1", "image 2"],

    "description": "",

    "highlighted": true,

    "visaPriceOptionsToUpsert": [
      {
        // UPDATE EXISTING OPTION (ID provided)
        "id": "EXISTING_PRICE_ID_1",
        "durationInDays": 365,
        "price": 350.0
      },
      {
        // CREATE NEW OPTION (ID omitted)
        "durationInDays": 90,
        "price": 150.0
      }
    ],

    "durationOptionIdsToDelete": [
      "EXISTING_PRICE_ID_TO_DELETE_A",
      "EXISTING_PRICE_ID_TO_DELETE_B"
    ]
  }
}
```

</details>

<details>
<summary><strong>Update Visa Checklist Status</strong></summary>

**query**

```graphql
mutation ChangeVisaChecklistStatus($id: String!, $status: Status!) {
  changeVisaChecklistStatus(id: $id, status: $status) {
    message
    checklist {
      id
      country
      location
      status
      archived
      highlighted
      datePublished
      images
      visaPriceOptions {
        id
        durationInDays
        price
      }
    }
  }
}
```

**variable**

```json
{
  "id": "clz8u3hya00023b0k6sg7trw1",
  "status": "HIGHLIGHTED"
}
```

</details>

<details>
<summary><strong>Delete Visa Checklist</strong></summary>

**query**

```graphql
mutation DeleteVisaChecklist($id: ID!) {
  deleteVisaChecklist(id: $id) {
    message
  }
}
```

**variable**

```json
{
  "id": "33a67dc4-e2d5-494f-b64d-840b9fe28416"
}
```

</details>

<details>
<summary><strong>Get one Visa Checklist</strong></summary>

**query**

```graphql
query GetVisaChecklist($id: ID!) {
  getVisaChecklist(id: $id) {
    id
    country
    location
    description
    status
    images
    visaPriceOptions {
      id
      durationInDays
      price
    }
  }
}
```

**variable**

```json
{
  "id": "33a67dc4-e2d5-494f-b64d-840b9fe28416"
}
```

</details>

<details>
<summary><strong>Get all Published Visa Checklist</strong></summary>

**query**

```graphql
query {
  getAllPublishedVisaChecklists {
    id
    country
    location
    status
    datePublished
  }
}
```

</details>

<details>
<summary><strong>Get Highlighted Visa Checklists</strong></summary>

**query**

```graphql
query {
  getHighlightedVisaChecklist {
    id
    country
    location
    highlighted
    status
  }
}
```

</details>

<details>
<summary><strong>Get all Visa Checklists</strong></summary>

**query**

```graphql
query GetAllVisaChecklists($filter: VisaChecklistFilterInput) {
  getAllVisaChecklists(filter: $filter) {
    data {
      id
      country
      location
      status
      datePublished
      createdAt
    }
    total
    page
    pageSize
  }
}
```

**variables**
Filter by Status (PUBLISHED)

```json
{ "filter": { "status": "PUBLISHED" } }
```

Filter by Country

```json
{
  "filter": {
    "country": "Paris"
  }
}
```

Filter by location

```json
{ "filter": { "location": "Toronto" } }
```

no filter(pagination)

```json
{ "filter": { "page": 2, "pageSize": 5 } }
```

</details>

<details>
<summary><strong>Search Visa Checklists</strong></summary>

**query**

```graphql
query SearchVisaChecklist($term: String!) {
  searchVisaChecklist(term: $term) {
    id
    country
    location
    status
    highlighted
  }
}
```

**variables**

Filter by Status (PUBLISHED)

```json
{
  "term": "india"
}
```

</details>

## 6. Subscribe for updates

<details>
<summary><strong>Subscribe for updates</strong></summary>

**query**

```graphql
mutation SubscribeToUpdates($data: CreateEmailSubscriberInput!) {
  subscribeToUpdates(data: $data) {
    message
    subscriber {
      id
      email
      createdAt
      updatedAt
    }
  }
}
```

**variables**

```json
{
  "data": {
    "email": "vtr@gmail.com"
  }
}
```

</details>

<details>
<summary><strong>Get All Subscribers </strong></summary>

**query**

```graphql
query GetAllSubscribers($page: Int, $pageSize: Int) {
  getAllSubscribers(page: $page, pageSize: $pageSize) {
    data {
      id
      email
      createdAt
      updatedAt
    }
    total
    page
    pageSize
  }
}
```

**variables**

```json
{
  "page": 3,
  "pageSize": 5
}
```

</details>

<details>
<summary><strong>SearchSubscribers </strong></summary>

**query**

```graphql
query SearchSubscribers($term: String!) {
  searchSubscribers(term: $term) {
    id
    email
    createdAt
    updatedAt
  }
}
```

**variables**
full match or partial match

```json
{
  "term": "example"
}
```

</details>

## 7. Request Services

<details>
<summary><strong>Request Flight Booking </strong></summary>

**query**

```graphql
mutation RequestFlightBooking($input: CreateFlightBookingInput!) {
  requestFlightBooking(input: $input) {
    message
    flightRequest {
      id
      fullName
      email
      phoneNo
      from
      to
      departureDate
      returnDate
      numberOfPersons
      preferredAirline
      ticketClass
      flightType
      requestDate
      requestType
      status
      createdAt
      updatedAt
    }
  }
}
```

**variables**

```json
{
  "input": {
    "fullName": " ",
    "email": " ",
    "phoneNo": "",
    "requestType": "FLIGHT_BOOKING",
    "from": "",
    "to": "Lodon",
    "departureDate": "",
    "returnDate": "",
    "numberOfPersons": ,
    "preferredAirline": " ",
    "ticketClass": "",
    "flightType": " "
  }
}
```

flight types

```
ONE_WAY
ROUND_TRIP
MULTI_CITY
```

</details>

<details>
<summary><strong>Request Visa Assistance </strong></summary>

**query**

```graphql
mutation CreateVisaRequest($input: VisaRequestInput!) {
  createVisaRequest(input: $input) {
    message
    visaRequest {
      id
      fullName
      email
      phoneNo
      purposeOfTravel
      destinationCountry
      tavelTime
      status
      requestType
    }
  }
}
```

**variables**

```json
{
  "input": {
    "fullName": " ",
    "email": "",
    "phoneNo": "",
    "requestType": "VISA_ASSISTANCE",
    "purposeOfTravel": " ",
    "destinationCountry": "",
    "tavelTime": ""
  }
}
```

</details>

<details>
<summary><strong>Request Private Jet Charter </strong></summary>

**query**

```graphql
mutation RequestPrivateJet($input: RequestPrivateJetInput!) {
  requestPrivateJet(input: $input) {
    message
    requestData {
      id
      fullName
      email
      phoneNo
      from
      to
      departureDate
      returnDate
      flightType
      numberOfPersons
      typeOfJet
      requestType
      status
    }
  }
}
```

**variables**

```json
{
  "input": {
    "fullName": "",
    "email": "",
    "phoneNo": "",
    "requestType": "PRIVATE_JET_CHARTER",
    "from": "",
    "to": "",
    "departureDate": "",
    "returnDate": "",
    "numberOfPersons": ,
    "flightType": "",
    "typeOfJet": ""
  }
}

```

flight types

```
ONE_WAY
ROUND_TRIP
MULTI_CITY
```

</details>

<details>
<summary><strong>Request Hotel Reservation</strong></summary>

**query**

```graphql
mutation RequestHotelReservation($input: RequestHotelreservtion!) {
  requestHotelReservation(input: $input) {
    message
    requestData {
      id
      fullName
      email
      phoneNo
      arrivalDate
      departureDate
      numberOfPersons
      destinationCountry
      comment
      additionalRequest
      requestType
      status
    }
  }
}
```

**variables**

```json
{
  "input": {
    "fullName": " ",
    "email": " ",
    "phoneNo": "",
    "requestType": "HOTEL_RESERVATION",
    "arrivalDate": " ",
    "departureDate": "",
    "numberOfPersons": ,
    "destinationCountry": "UA",
    "comment": "",
    "additionalRequest": ""
  }
}
```

</details>

<details>
<summary><strong>Request Tour Package</strong></summary>

**query**

```graphql
mutation RequestTourPackage($input: RequestTourPackage!) {
  requestTourPackage(input: $input) {
    message
    requestData {
      id
      fullName
      email
      phoneNo
      destinationCountry
      budget
      travelDate
      numberOfPersons
      accomodationPreference
      tourPackageType
      additionalRequest
      comment
      status
      requestType
    }
  }
}
```

**variables**

```json
{
  "input": {
    "fullName": "",
    "email": "",
    "phoneNo": "",
    "requestType": "TOUR_PACKAGE",
    "destinationCountry": "",
    "budget": "",
    "travelDate": "",
    "numberOfPersons": ,
    "accomodationPreference": "",
    "tourPackageType": "",
    "additionalRequest": "",
    "comment": ""
  }
}

```

</details>

<details>
<summary><strong>Request Executive Shuttle </strong></summary>

**query**

```graphql
mutation RequestExecutiveShuttle($input: RequestExexutiveShuttleInput!) {
  requestExecutiveShuttle(input: $input) {
    message
    shuttleRequest {
      id
      fullName
      email
      phoneNo
      arrivalAirport
      arrivalDate
      arrivalTime
      rideType
      status
      requestType
    }
  }
}
```

**variables**

```json
{
  "input": {
    "fullName": "",
    "email": "",
    "phoneNo": "",
    "requestType": "EXECUTIVE_SHUTTLE",
    "arrivalAirport": "   ",
    "arrivalDate": "",
    "arrivalTime": "",
    "numberOfPersons": ,
    "rideType": " "
  }
}

```

---

(enum) RideType

AIRPORT_PICKUP
CAR_HIRE

---

</details>

<details>
<summary><strong>Request Travel Insurance </strong></summary>

**query**

```graphql
mutation RequestTravelInsurance($input: RequestTravelInsurance!) {
  requestTravelInsurance(input: $input) {
    message
    requestData {
      id
      fullName
      email
      phoneNo
      durationOfInsurance
      numberOfPersons
      destinationCountry
      insuranceType
      requestType
      status
    }
  }
}
```

**variables**

```json
{
  "input": {
    "fullName": "",
    "email": "",
    "phoneNo": "",
    "requestType": "TRAVEL_INSURANCE",
    "durationOfInsurance": ,
    "numberOfPersons": ,
    "destinationCountry": "",
    "insuranceType": ""
  }
}

```

</details>

<details>
<summary><strong>Sehembz Pay</strong></summary>

**query**

```graphql
mutation RequestSehembzPay($input: RequestSehembzPay!) {
  requestSehembzPay(input: $input) {
    message
    requestData {
      id
      fullName
      email
      phoneNo
      reasonForContacting
      amount
      status
      requestType
    }
  }
}
```

**variables**

```json
{
  "input": {
    "fullName": " ",
    "email": "",
    "phoneNo": "",
    "requestType": "SEHEMBZ_PAY",
    "reasonForContacting": "",
    "amount": ""
  }
}
```

</details>

<details>
<summary><strong>Update Request Status</strong></summary>

**query**

```graphql
mutation UpdateRequestStatus($id: String!, $status: RequestStatus!) {
  updateRequestStatus(id: $id, status: $status) {
    fullName
    email
    phoneNo
    requestType
    status
  }
}
```

**variables**

```json
{
  "id": "<REQUEST ID>",
  "status": ""
}
```

---

(enum) RequestStatus
OPEN
IN_PROGRESS
COMPLETED

---

</details>

<details>
<summary><strong>Fetch one Request Details</strong></summary>

**query**

```graphql
query GetRequestById($id: String!) {
  getRequestById(id: $id) {
    __typename

    ... on FlightBookingType {
      id
      fullName
      email
      phoneNo
      requestType
      status
      from
      to
      departureDate
      returnDate
      preferredAirline
      ticketClass
    }

    ... on VisaRequestType {
      id
      fullName
      email
      phoneNo
      requestType
      status
      destinationCountry
      purposeOfTravel
      tavelTime
    }

    ... on PrivateJetRequest {
      id
      fullName
      email
      phoneNo
      requestType
      status
      from
      to
      numberOfPersons
      flightType
      departureDate
      returnDate
      typeOfJet
    }

    ... on HotelReservation {
      id
      fullName
      email
      phoneNo
      requestType
      status
      destinationCountry
      arrivalDate
      departureDate
      numberOfPersons
    }

    ... on TourPackageRequest {
      id
      fullName
      email
      phoneNo
      requestType
      status
      destinationCountry
      budget
      tourPackageType
    }

    ... on TourPackageRequest {
      id
      fullName
      email
      phoneNo
      requestType
      status
      destinationCountry
      tourPackageType
      travelDate
      numberOfPersons
    }

    ... on ExecutiveShuttleRequest {
      id
      fullName
      email
      phoneNo
      requestType
      status
      arrivalAirport
      arrivalTime
      rideType
    }

    ... on TravelInsurance {
      id
      fullName
      email
      phoneNo
      requestType
      status
      destinationCountry
      insuranceType
      durationOfInsurance
      numberOfPersons
    }

    ... on SehembzPayRequest {
      id
      fullName
      email
      phoneNo
      requestType
      status
      reasonForContacting
      amount
    }
  }
}
```

**variables**

```json
{
  "id": "cb765c9c-2968-45f1-978b-7c20babd4c12"
}
```

</details>

<details>
<summary><strong>Get All Requests </strong></summary>

**query**

```graphql
query GetAllRequests($filter: RequestFilterInput) {
  getAllRequests(filter: $filter) {
    total
    page
    pageSize
    data {
      __typename

      ... on FlightBookingType {
        id
        fullName
        email
        phoneNo
        requestType
        status
        requestDate
        from
        to
        departureDate
        returnDate
        numberOfPersons
        preferredAirline
        ticketClass
        flightType
      }

      ... on VisaRequestType {
        id
        fullName
        email
        phoneNo
        requestType
        status
        requestDate
        destinationCountry
        purposeOfTravel
        tavelTime
      }

      ... on PrivateJetRequest {
        id
        fullName
        email
        phoneNo
        requestType
        status
        requestDate
        from
        to
        departureDate
        returnDate
        numberOfPersons
        typeOfJet
        flightType
      }

      ... on ExecutiveShuttleRequest {
        id
        fullName
        email
        phoneNo
        requestType
        status
        requestDate
        arrivalAirport
        arrivalDate
        arrivalTime
        rideType
      }

      ... on TravelInsurance {
        id
        fullName
        email
        phoneNo
        requestType
        status
        requestDate
        destinationCountry
        insuranceType
        durationOfInsurance
        numberOfPersons
      }

      ... on HotelReservation {
        id
        fullName
        email
        phoneNo
        requestType
        status
        requestDate
        destinationCountry
        arrivalDate
        departureDate
        numberOfPersons
        comment
        additionalRequest
      }

      ... on TourPackageRequest {
        id
        fullName
        email
        phoneNo
        requestType
        status
        requestDate
        destinationCountry
        budget
        travelDate
        numberOfPersons
        accomodationPreference
        tourPackageType
        additionalRequest
        comment
      }

      ... on SehembzPayRequest {
        id
        fullName
        email
        phoneNo
        requestType
        status
        requestDate
        reasonForContacting
        amount
      }
    }
  }
}
```

**variables**

filter by request type

```json
{
  "filter": {
    "requestType": "FLIGHT_BOOKING"
  }
}
```

filter by status

```json
{
  "filter": {
    "status": "OPEN",
    "page": 2
  }
}
```

filter by date range

```json
{
  "filter": {
    "startDate": "2025-10-01T00:00:00Z",
    "endDate": "2025-10-15T23:00:00Z"
  }
}
```

filter by pre defined dates

```json
{
  "filter": {
    "dateRangePreset": "last_7_days"
  }
}
```

```

(enum) RequestStatus
OPEN
IN_PROGRESS
COMPLETED
```

```
(enum) RequestType

  FLIGHT_BOOKING
  HOTEL_RESERVATION
  VISA_ASSISTANCE
  PRIVATE_JET_CHARTER
  EXECUTIVE_SHUTTLE
  TRAVEL_INSURANCE
  SEHEMBZ_PAY
  TOUR_PACKAGE

```

</details>
