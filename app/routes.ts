import {type RouteConfig, index, route} from "@react-router/dev/routes";
import {file} from "@babel/types";

export default [
    index("routes/home.tsx"),
    route('/auth', 'routes/auth.tsx'),
    route('/upload','routes/upload.tsx'),
    route('/resume/:id','routes/Resume.tsx' )
] satisfies RouteConfig;
