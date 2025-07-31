import { Routes } from "@angular/router";

import { ManageUserComponent } from "./pages/manage-user/manage-user.component";
import { AdminComponent } from "./admin.component";
import { ManagePostComponent } from "./pages/manage-post/manage-post.component";
import { ManageGroupComponent } from "./pages/manage-group/manage-group.component";
export const adminRoutes:Routes = [
    {
        path: '',
        component:AdminComponent,
        children:[
            {
                path: '',
                redirectTo:'manage-user',
                pathMatch:"full"
            },
            {
               path:'manage-user',
               component:ManageUserComponent
            },
            {
                path:'manage-post',
                component:ManagePostComponent
            },
            {
                path:'manage-group',
                component:ManageGroupComponent
            }
        ]
    }
]