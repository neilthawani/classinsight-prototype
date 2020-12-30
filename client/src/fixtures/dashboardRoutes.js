import Dashboard from "../components/dashboard/Dashboard";
import TalkRatio from '../components/visualizations/talk-ratio/TalkRatio';
import Transcript from '../components/visualizations/transcript/Transcript';
import TurnTaking from '../components/visualizations/turn-taking/TurnTaking';

import Icon from '@mdi/react';
import { mdiViewDashboardVariantOutline, mdiBarcode, mdiChartGantt, mdiCommentTextMultipleOutline } from '@mdi/js';

var definitions = function(admin) {
    var isAdmin = admin && Object.keys(admin).length > 0 ? true : false;
    var baseAdminPath = isAdmin ? `/admin/user/${admin.userId}/preview` : "";

    return [{
        path: `${baseAdminPath}/dashboard`,
        component: (props) => ( <Dashboard {...props} /> ),
        buttonValue: "dashboard",
        label: "Dashboard",
        icon: <Icon path={mdiViewDashboardVariantOutline} className="button-selector-item-icon" size={1} />
    }, {
        path: `${baseAdminPath}/talk-ratio`,
        component: (props) => ( <TalkRatio {...props} /> ),
        buttonValue: "talk-ratio",
        label: "Talk Ratio",
        icon: <Icon path={mdiBarcode} className="button-selector-item-icon" size={1.5} />
    }, {
        path: `${baseAdminPath}/turn-taking`,
        component: (props) => ( <TurnTaking {...props} /> ),
        buttonValue: "turn-taking",
        label: "Turn Taking",
        icon: <Icon path={mdiChartGantt} className="button-selector-item-icon" size={1} />
    }, {
        path: `${baseAdminPath}/transcript`,
        component: (props) => ( <Transcript {...props} /> ),
        buttonValue: "transcript",
        label: "Transcript",
        icon: <Icon path={mdiCommentTextMultipleOutline} className="button-selector-item-icon" size={1} />
    }];
};

var paths = definitions().map((routeObj => routeObj.path));

var dashboardRoutes = { definitions, paths };

export default dashboardRoutes;
