import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) => (
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  })
);

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach((model) => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return (props) => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () => models.filter(
      model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then((raw) => {
        const Component = raw.default || raw;
        return props => createElement(Component, {
          ...props,
          routerData: routerDataCache,
        });
      });
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach((item) => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = (app) => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user/login'], () => import('../layouts/BasicLayout')),
    },
    // '/result/success': {
    //   component: dynamicWrapper(app, [], () => import('../routes/Result/Success')),
    // },
    // '/result/fail': {
    //   component: dynamicWrapper(app, [], () => import('../routes/Result/Error')),
    // },
    // '/exception/403': {
    //   component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    // },
    // '/exception/404': {
    //   component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    // },
    // '/exception/500': {
    //   component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    // },
    // '/exception/trigger': {
    //   component: dynamicWrapper(app, [], () => import('../routes/Exception/triggerException')),
    // },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['user/login'], () => import('../routes/User/Login')),
    },
    // '/user/register': {
    //   component: dynamicWrapper(app, ['user/register'], () => import('../routes/User/Register')),
    // },
    // '/user/register-result': {
    //   component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
    // },
    '/user/reset-password': {
      component: dynamicWrapper(app, ['user/login'], () => import('../routes/User/ResetPassword')),
    },
    '/user/reset-password-result/:account': {
      component: dynamicWrapper(app, [], () => import('../routes/User/ResetPasswordResult')),
    },
    '/user/do-reset-password': {
      component: dynamicWrapper(app, ['user/login'], () => import('../routes/User/DoResetPassword')),
    },
    '/user/do-reset-password-result': {
      component: dynamicWrapper(app, [], () => import('../routes/User/DoResetPasswordResult')),
    },
    '/user/password/reset': {
      component: dynamicWrapper(app, ['user/login'], () => import('../routes/User/ResetPasswordHandle')),
    },
    '/setting/wechat-push': {
      component: dynamicWrapper(app, ['settings/wechatPush', 'log/log'], () => import('../routes/Setting/WechatPush')),
    },
    '/setting/wechat-relation': {
      component: dynamicWrapper(app, ['settings/wechatRelation'], () => import('../routes/Setting/WechatRelation')),
    },
    '/setting/merchants-basic': {
      component: dynamicWrapper(app, ['settings/merchantsBasic'], () => import('../routes/Setting/MerchantsBasic')),
    },
    '/setting/doctor-wall': {
      component: dynamicWrapper(app, ['settings/doctorWall'], () => import('../routes/Setting/DoctorWall')),
    },
    '/setting/account': {
      component: dynamicWrapper(app, ['settings/account'], () => import('../routes/Setting/Account')),
    },
    '/setting/role': {
      component: dynamicWrapper(app, ['settings/account'], () => import('../routes/Setting/Roles')),
    },
    '/setting/alert-manage': {
      component: dynamicWrapper(app, ['settings/alertManage', 'log/log'], () => import('../routes/Setting/AlertManage')),
    },
    '/setting/data/doctor-skill-manage': {
      component: dynamicWrapper(app, ['settings/doctorSkillManage'], () => import('../routes/Setting/DoctorSkillManage')),
    },
    '/setting/data/doctor-config-manage': {
      component: dynamicWrapper(app, ['settings/doctorConfigManage'], () => import('../routes/Setting/DoctorConfigManage')),
    },
    '/setting/disease': {
      component: dynamicWrapper(app, ['settings/disease'], () => import('../routes/Setting/Disease')),
    },
    '/pointLocationManage/users': {
      component: dynamicWrapper(app, ['customer/users', 'log/log'], () => import('../routes/Customer/Users')),
    },
    '/pointLocationManage/index': {
      component: dynamicWrapper(app, ['pointLocationManage', 'log/log', 'rule', 'common'], () => import('../routes/pointLocationManage/Index')),
    },
    '/customer/record': {
      component: dynamicWrapper(app, ['customer/record', 'log/log'], () => import('../routes/Customer/Record')),
    },
    '/doctor/list': {
      component: dynamicWrapper(app, ['doctor/doctorList'], () => import('../routes/Doctor/DoctorList')),
    },
    '/doctor/detail/:id?': {
      component: dynamicWrapper(app, ['doctor/doctorDetail'], () => import('../routes/Doctor/DoctorDetail')),
    },
    '/doctor/price-manage': {
      component: dynamicWrapper(app, ['doctor/priceManage'], () => import('../routes/Doctor/PriceManage')),
    },
    '/doctor/commission': {
      component: dynamicWrapper(app, ['doctor/commission', 'log/log'], () => import('../routes/Doctor/Commission')),
    },
    '/doctor/schedule': {
      component: dynamicWrapper(app, ['doctor/doctorSchedule'], () => import('../routes/Doctor/DoctorSchedule')),
    },
    '/doctor/skill': {
      component: dynamicWrapper(app, ['doctor/skill'], () => import('../routes/Doctor/Skill')),
    },
    '/doctor/doctor-online': {
      component: dynamicWrapper(app, ['doctor/doctorOnline'], () => import('../routes/Doctor/DoctorOnline')),
    },
    '/order/order': {
      component: dynamicWrapper(app, ['order/order', 'log/log'], () => import('../routes/Order/Order')),
    },
    '/order/child-disease': {
      component: dynamicWrapper(app, ['order/childDisease', 'log/log'], () => import('../routes/Order/ChildDisease')),
    },
    '/content/outpatient': {
      component: dynamicWrapper(app, ['content/outpatient', 'log/log'], () => import('../routes/Content/Outpatient')),
    },
    '/content/suggest': {
      component: dynamicWrapper(app, ['content/suggest'], () => import('../routes/Content/Suggest')),
    },
    '/content/question': {
      component: dynamicWrapper(app, ['content/question'], () => import('../routes/Content/Question')),
    },
    '/content/inspection-report': {
      component: dynamicWrapper(app, ['content/inspectionReport', 'common'], () => import('../routes/Content/InspectionReport')),
    },
    '/contract/manage': {
      component: dynamicWrapper(app, ['contract/manage', 'log/log'], () => import('../routes/Contract/Contract')),
    },
    '/finacial/withdrawals': {
      component: dynamicWrapper(app, ['finacial/withdrawals'], () => import('../routes/Financial/WithdrawalList')),
    },
    '/da/order-service': {
      component: dynamicWrapper(app, ['da/orderService'], () => import('../routes/DA/OrderService')),
    },
    '/goods/service/operation-item': {
      component: dynamicWrapper(app, ['goods/operationItem', 'log/log'], () => import('../routes/Goods/OperationItem')),
    },
    '/goods/service/service-item': {
      component: dynamicWrapper(app, ['goods/serviceItem', 'log/log', 'goods/operationItem'], () => import('../routes/Goods/ServiceItem')),
    },
    '/goods/rule/compositing': {
      component: dynamicWrapper(app, ['goods/compositing', 'log/log', 'goods/serviceItem'], () => import('../routes/Goods/Compositing')),
    },
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());
  const routerData = {};
  Object.keys(routerConfig).forEach((item) => {
    const menuItem = menuData[item.replace(/^\//, '')] || {};
    routerData[item] = {
      ...routerConfig[item],
      name: routerConfig[item].name || menuItem.name,
      authority: routerConfig[item].authority || menuItem.authority,
    };
  });
  return routerData;
};
