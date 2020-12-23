import Dashboard from "../components/dashboard/Dashboard";
import TalkRatio from '../components/visualizations/talk-ratio/TalkRatio';
import Transcript from '../components/visualizations/transcript/Transcript';
import TurnTaking from '../components/visualizations/turn-taking/TurnTaking';

import Icon from '@mdi/react';
import { mdiViewDashboardVariantOutline, mdiBarcode, mdiChartGantt, mdiCommentTextMultipleOutline, mdiAccount } from '@mdi/js';

var definitions = function(activeParser, admin) {
    var isAdmin = admin ? Object.keys(admin).length > 0 : false,
        baseAdminPath = isAdmin ? `/admin/user/${admin.userId}/preview` : "";

    return [{
        path: `${baseAdminPath}/dashboard`,
        component: (props) => ( <Dashboard {...props} activeParser={activeParser} admin={admin} /> ),
        label: "Dashboard",
        icon: <Icon path={mdiViewDashboardVariantOutline} className="button-selector-item-icon" size={1} />
    }, {
        path: `${baseAdminPath}/talk-ratio`,
        component: (props) => ( <TalkRatio {...props} activeParser={activeParser} admin={admin} /> ),
        label: "Talk Ratio",
        icon: <Icon path={mdiBarcode} className="button-selector-item-icon" size={1.5} />
    }, {
        path: `${baseAdminPath}/turn-taking`,
        component: (props) => ( <TurnTaking {...props} activeParser={activeParser} admin={admin} /> ),
        label: "Turn Taking",
        icon: <Icon path={mdiChartGantt} className="button-selector-item-icon" size={1} />
    }, {
        path: `${baseAdminPath}/transcript`,
        component: (props) => ( <Transcript {...props} activeParser={activeParser} admin={admin} /> ),
        label: "Transcript",
        icon: <Icon path={mdiCommentTextMultipleOutline} className="button-selector-item-icon" size={1} />
    }];
};

var paths = definitions().map((routeObj => routeObj.path));

var dashboardRoutes = { definitions, paths };

export default dashboardRoutes;
