import Dashboard from "../components/dashboard/Dashboard";
import TalkRatio from '../components/visualization/talk-ratio/TalkRatio';
import Transcript from '../components/visualization/transcript/Transcript';
import TurnTaking from '../components/visualization/turn-taking/TurnTaking';

import Icon from '@mdi/react';
import { mdiViewDashboardVariantOutline, mdiBarcode, mdiChartGantt, mdiCommentTextMultipleOutline } from '@mdi/js';

var definitions = function(admin) {
    var routePrefix = "/visualization";

    if (admin) {
        routePrefix = `/visualization/${admin.userId}/preview`;
    }

    return [{
        path: `${routePrefix}/dashboard`,
        component: (props) => ( <Dashboard {...props} /> ),
        buttonValue: "dashboard",
        label: "Dashboard",
        icon: <Icon path={mdiViewDashboardVariantOutline} className="button-selector-item-icon" size={1} />
    }, {
        path: `${routePrefix}/talk-ratio`,
        component: (props) => ( <TalkRatio {...props} /> ),
        buttonValue: "talk-ratio",
        label: "Talk Ratio",
        icon: <Icon path={mdiBarcode} className="button-selector-item-icon" size={1.5} />
    }, {
        path: `${routePrefix}/turn-taking`,
        component: (props) => ( <TurnTaking {...props} /> ),
        buttonValue: "turn-taking",
        label: "Turn Taking",
        icon: <Icon path={mdiChartGantt} className="button-selector-item-icon" size={1} />
    }, {
        path: `${routePrefix}/transcript`,
        component: (props) => ( <Transcript {...props} /> ),
        buttonValue: "transcript",
        label: "Transcript",
        icon: <Icon path={mdiCommentTextMultipleOutline} className="button-selector-item-icon" size={1} />
    }];
};

var paths = definitions().reduce((prev, routeObj) => {
    prev.push(routeObj.path);
    return prev;
}, []);

var dashboardRoutes = { definitions, paths };

export default dashboardRoutes;
