webpackJsonp([1,4],{

/***/ 132:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__backoffice_service__ = __webpack_require__(162);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BackofficeComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var BackofficeComponent = (function () {
    function BackofficeComponent(service) {
        this.service = service;
    }
    BackofficeComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.service.getUsers()
            .then(function (users) {
            _this.users = users.map(function (user) {
                return user;
            });
        });
    };
    BackofficeComponent.prototype.createUser = function () {
        if (this.newName == null || this.newUsername == null || this.newUsername == null || this.newPassword == null || this.newRole == null) {
            this.errorMessage = 'Por favor, ingrese todos los datos';
        }
        else if (this.newRole != 'admin' && this.newRole != 'user' && this.newRole != 'manager') {
            this.errorMessage = '';
            this.errorMessage = 'Valor incorrecto de rol. Por favor, ingrese admin, user o manager';
        }
        else {
            this.service.createUser(this.newName, this.newSurname, this.newUsername, this.newPassword, this.newRole);
            this.errorMessage = '';
        }
    };
    BackofficeComponent.prototype.modifyUser = function (i) {
        if (this.users[i].name != null && this.users[i].surname != null && this.users[i].username != null && this.users[i].password != null && this.users[i].role != null) {
            this.service.modifyUser(this.users[i].name, this.users[i].surname, this.users[i].username, this.users[i].password, this.users[i].role, this.users[i]._ref, this.users[i].id);
        }
    };
    BackofficeComponent.prototype.deleteUser = function (i) {
        this.service.deleteUser(this.users[i].id);
    };
    return BackofficeComponent;
}());
BackofficeComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* Component */])({
        selector: 'app-backoffice',
        template: __webpack_require__(181),
        styles: [__webpack_require__(172)],
        providers: [__WEBPACK_IMPORTED_MODULE_1__backoffice_service__["a" /* BackofficeService */]]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__backoffice_service__["a" /* BackofficeService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__backoffice_service__["a" /* BackofficeService */]) === "function" && _a || Object])
], BackofficeComponent);

var _a;
//# sourceMappingURL=backoffice.component.js.map

/***/ }),

/***/ 133:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__createrules_service__ = __webpack_require__(163);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CreateRulesComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var CreateRulesComponent = (function () {
    function CreateRulesComponent(service) {
        this.service = service;
    }
    CreateRulesComponent.prototype.ngOnInit = function () {
    };
    CreateRulesComponent.prototype.crearRegla = function () {
        var _this = this;
        this.rule = {};
        this.rule.active = true;
        this.rule.language = 'node-rules';
        this.rule.lastcommit = null;
        this.rule.blob = this.blob;
        this.service.createRule(this.rule)
            .then(function (resultRule) {
            _this.resultRule = resultRule;
        });
    };
    CreateRulesComponent.prototype.getReglas = function () {
        var _this = this;
        this.service.getRules()
            .then(function (rules) {
            _this.rules = rules;
        });
    };
    CreateRulesComponent.prototype.updateRegla = function (i) {
        this.service.updateRule(this.rules[i].id, this.rules[i].language, this.rules[i].active, this.rules[i]._ref);
    };
    CreateRulesComponent.prototype.deleteRegla = function (i) {
        this.service.deleteRule(this.rules[i].id);
    };
    return CreateRulesComponent;
}());
CreateRulesComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* Component */])({
        selector: 'app-create-rules',
        template: __webpack_require__(182),
        styles: [__webpack_require__(173)],
        providers: [__WEBPACK_IMPORTED_MODULE_1__createrules_service__["a" /* CreaterulesService */]]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__createrules_service__["a" /* CreaterulesService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__createrules_service__["a" /* CreaterulesService */]) === "function" && _a || Object])
], CreateRulesComponent);

var _a;
//# sourceMappingURL=create-rules.component.js.map

/***/ }),

/***/ 134:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__login_service_service__ = __webpack_require__(164);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__(66);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginComponentComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var LoginComponentComponent = (function () {
    function LoginComponentComponent(loginService, router) {
        this.loginService = loginService;
        this.router = router;
        this.user = "GAGimenez";
        this.password = "1234";
        this.tokenReceived = "";
        this.loginError = "";
    }
    LoginComponentComponent.prototype.ngOnInit = function () { };
    LoginComponentComponent.prototype.action = function () {
        var _this = this;
        this.loginError = "";
        this.loginService
            .getToken(this.user, this.password)
            .then(function (token) {
            _this.tokenReceived = token.token.token;
            localStorage.setItem('token', _this.tokenReceived);
            localStorage.setItem('username', _this.user);
            _this.router.navigate(['/mainmenu']);
        }).catch(function (e) {
            _this.loginError = "Error de autenticacion";
        });
    };
    return LoginComponentComponent;
}());
LoginComponentComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* Component */])({
        selector: 'app-login-component',
        template: __webpack_require__(183),
        styles: [__webpack_require__(174)],
        providers: [__WEBPACK_IMPORTED_MODULE_1__login_service_service__["a" /* LoginServiceService */]]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__login_service_service__["a" /* LoginServiceService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__login_service_service__["a" /* LoginServiceService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* Router */]) === "function" && _b || Object])
], LoginComponentComponent);

var _a, _b;
//# sourceMappingURL=login-component.component.js.map

/***/ }),

/***/ 135:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(66);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MainMenuComponentComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var MainMenuComponentComponent = (function () {
    function MainMenuComponentComponent(router) {
        this.router = router;
    }
    MainMenuComponentComponent.prototype.ngOnInit = function () {
    };
    MainMenuComponentComponent.prototype.goToUsers = function () {
        this.router.navigate(['/users']);
    };
    MainMenuComponentComponent.prototype.goToServers = function () {
        this.router.navigate(['/servers']);
    };
    MainMenuComponentComponent.prototype.goToTrips = function () {
        this.router.navigate(['/trips']);
    };
    MainMenuComponentComponent.prototype.goToRules = function () {
        this.router.navigate(['/rules']);
    };
    MainMenuComponentComponent.prototype.goToBackofficeUsers = function () {
        this.router.navigate(['/business-users']);
    };
    MainMenuComponentComponent.prototype.goToCreateRule = function () {
        this.router.navigate(['/create-rules']);
    };
    return MainMenuComponentComponent;
}());
MainMenuComponentComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* Component */])({
        selector: 'app-main-menu-component',
        template: __webpack_require__(184),
        styles: [__webpack_require__(175)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */]) === "function" && _a || Object])
], MainMenuComponentComponent);

var _a;
//# sourceMappingURL=main-menu-component.component.js.map

/***/ }),

/***/ 136:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__rules_service__ = __webpack_require__(165);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RulesComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var RulesComponent = (function () {
    function RulesComponent(ruleService) {
        this.ruleService = ruleService;
        this.distance = 0;
        this.mail = '';
        this.ownDailyTrips = 0;
        this.totalTrips = 0;
        this.fecha = 0;
        this.cost;
        this.balance = 0;
        this.cantViajes = 0;
        this.matchingRules = [];
    }
    RulesComponent.prototype.ngOnInit = function () {
    };
    RulesComponent.prototype.calculateCost = function () {
        var _this = this;
        var factJson = {
            distance: this.distance,
            mail: this.mail,
            ownDailyTrips: this.ownDailyTrips,
            totalTrips: this.totalTrips,
            fecha: this.fecha,
            balance: this.balance,
            cantViajes: this.cantViajes
        };
        this.ruleService.getResult(factJson)
            .then(function (result) {
            if (result.tripOk == true) {
                _this.cost = 'Costo: ' + result.cost * result.discount;
            }
            else {
                _this.cost = 'Viaje rechazado';
            }
            _this.matchingRules = result.matchPath;
        }).catch(function (e) {
            console.log(e);
        });
    };
    return RulesComponent;
}());
RulesComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* Component */])({
        selector: 'app-rules',
        template: __webpack_require__(185),
        styles: [__webpack_require__(176)],
        providers: [__WEBPACK_IMPORTED_MODULE_1__rules_service__["a" /* RulesService */]]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__rules_service__["a" /* RulesService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__rules_service__["a" /* RulesService */]) === "function" && _a || Object])
], RulesComponent);

var _a;
//# sourceMappingURL=rules.component.js.map

/***/ }),

/***/ 137:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__server_service__ = __webpack_require__(166);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ServerComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ServerComponent = (function () {
    function ServerComponent(serverService) {
        this.serverService = serverService;
    }
    ServerComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.serverService
            .getServers()
            .then(function (servers) {
            _this.servers = servers.map(function (server) {
                var fecha = new Date();
                var lastConnectionDate = new Date(server.lastconnection);
                lastConnectionDate.setMinutes(lastConnectionDate.getMinutes() + 5);
                if (lastConnectionDate.getTime() > fecha.getTime() && server.lastconnection != null) {
                    server.activo = true;
                    var activ = server.activo;
                }
                else {
                    server.activo = false;
                }
                return server;
            });
        });
    };
    ServerComponent.prototype.createServer = function () {
        var _this = this;
        this.serverService.createServer(this.serverName)
            .then(function (server) {
            _this.newServerToken = server.token;
            console.log(_this.newServerToken);
        });
    };
    ServerComponent.prototype.serverSelected = function (i) {
        console.log(this.servers[i].id);
        this.serverService.deleteServer(this.servers[i].id);
        this.servers = [];
        this.ngOnInit();
    };
    return ServerComponent;
}());
ServerComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* Component */])({
        selector: 'app-server',
        template: __webpack_require__(186),
        styles: [__webpack_require__(177)],
        providers: [__WEBPACK_IMPORTED_MODULE_1__server_service__["a" /* ServerService */]]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__server_service__["a" /* ServerService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__server_service__["a" /* ServerService */]) === "function" && _a || Object])
], ServerComponent);

var _a;
//# sourceMappingURL=server.component.js.map

/***/ }),

/***/ 138:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__trip_service_service__ = __webpack_require__(167);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TripComponentComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var TripComponentComponent = (function () {
    function TripComponentComponent(tripService) {
        var _this = this;
        this.tripService = tripService;
        this.NumberOfLastTripsShowed = 5;
        this.userId = '71';
        this.lastTripsMessage = 'Ultimos viajes dados de alta';
        this.tripService.getLastTrips(this.NumberOfLastTripsShowed)
            .then(function (lastTrips) {
            _this.lastTrips = lastTrips.map(function (trip) {
                return trip;
            });
        });
    }
    TripComponentComponent.prototype.ngOnInit = function () {
    };
    TripComponentComponent.prototype.buscar = function () {
        var _this = this;
        this.serverTripsMessage = '';
        this.lastTripsMessage = 'Viajes del usuario ' + this.userId;
        this.lastTrips = [];
        this.tripsFromServer = [];
        this.tripService
            .getTrips(this.userId)
            .then(function (trips) {
            _this.trips = trips.map(function (trip) {
                return trip;
            });
        });
    };
    TripComponentComponent.prototype.buscarPorAppserver = function () {
        var _this = this;
        this.serverTripsMessage = 'Viajes del appserver ' + this.userId;
        this.lastTripsMessage = '';
        this.lastTrips = [];
        this.tripsFromServer = [];
        this.trips = [];
        this.tripService.getAppserverTrips(this.userId)
            .then(function (trips) {
            _this.tripsFromServer = trips.map(function (trip) {
                return trip;
            });
        });
    };
    return TripComponentComponent;
}());
TripComponentComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* Component */])({
        selector: 'app-trip-component',
        template: __webpack_require__(187),
        styles: [__webpack_require__(178)],
        providers: [__WEBPACK_IMPORTED_MODULE_1__trip_service_service__["a" /* TripServiceService */]]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__trip_service_service__["a" /* TripServiceService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__trip_service_service__["a" /* TripServiceService */]) === "function" && _a || Object])
], TripComponentComponent);

var _a;
//# sourceMappingURL=trip-component.component.js.map

/***/ }),

/***/ 139:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__users_service_service__ = __webpack_require__(168);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UsersListComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var UsersListComponent = (function () {
    function UsersListComponent(usersService) {
        this.usersService = usersService;
    }
    UsersListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.usersService
            .getAllUsers()
            .then(function (users) {
            _this.users = users.map(function (user) {
                return user;
            });
        });
    };
    UsersListComponent.prototype.buscarUser = function () {
        var _this = this;
        var user;
        this.usersService
            .getOneUser(this.userId)
            .then(function (user) {
            _this.users = [user];
        });
    };
    UsersListComponent.prototype.deleteUser = function (i) {
        console.log(this.users[i].id);
        this.usersService.deleteUser(this.users[i].id);
    };
    return UsersListComponent;
}());
UsersListComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* Component */])({
        selector: 'app-users-list',
        template: __webpack_require__(188),
        styles: [__webpack_require__(179)],
        providers: [__WEBPACK_IMPORTED_MODULE_1__users_service_service__["a" /* UsersServiceService */]]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__users_service_service__["a" /* UsersServiceService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__users_service_service__["a" /* UsersServiceService */]) === "function" && _a || Object])
], UsersListComponent);

var _a;
//# sourceMappingURL=users-list.component.js.map

/***/ }),

/***/ 153:
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 153;


/***/ }),

/***/ 154:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__polyfills_ts__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser_dynamic__ = __webpack_require__(158);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_app_module__ = __webpack_require__(160);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__environments_environment__ = __webpack_require__(169);





if (__WEBPACK_IMPORTED_MODULE_4__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["a" /* enableProdMode */])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_3__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 159:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(3);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var AppComponent = (function () {
    function AppComponent() {
        this.title = 'app works!';
    }
    return AppComponent;
}());
AppComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* Component */])({
        selector: 'app-root',
        template: __webpack_require__(180),
        styles: [__webpack_require__(171)]
    })
], AppComponent);

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 160:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(157);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_component__ = __webpack_require__(159);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__server_server_component__ = __webpack_require__(137);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__user_users_list_component__ = __webpack_require__(139);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__login_login_component_component__ = __webpack_require__(134);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__app_routes__ = __webpack_require__(161);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__mainMenu_main_menu_component_main_menu_component_component__ = __webpack_require__(135);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__trip_component_trip_component_component__ = __webpack_require__(138);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__rules_rules_component__ = __webpack_require__(136);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__backoffice_backoffice_component__ = __webpack_require__(132);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__create_rules_create_rules_component__ = __webpack_require__(133);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};














var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["b" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */],
            __WEBPACK_IMPORTED_MODULE_5__server_server_component__["a" /* ServerComponent */],
            __WEBPACK_IMPORTED_MODULE_6__user_users_list_component__["a" /* UsersListComponent */],
            __WEBPACK_IMPORTED_MODULE_7__login_login_component_component__["a" /* LoginComponentComponent */],
            __WEBPACK_IMPORTED_MODULE_9__mainMenu_main_menu_component_main_menu_component_component__["a" /* MainMenuComponentComponent */],
            __WEBPACK_IMPORTED_MODULE_10__trip_component_trip_component_component__["a" /* TripComponentComponent */],
            __WEBPACK_IMPORTED_MODULE_11__rules_rules_component__["a" /* RulesComponent */],
            __WEBPACK_IMPORTED_MODULE_12__backoffice_backoffice_component__["a" /* BackofficeComponent */],
            __WEBPACK_IMPORTED_MODULE_13__create_rules_create_rules_component__["a" /* CreateRulesComponent */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormsModule */],
            __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* HttpModule */],
            __WEBPACK_IMPORTED_MODULE_8__app_routes__["a" /* routing */]
        ],
        providers: [],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */]]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 161:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_router__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__login_login_component_component__ = __webpack_require__(134);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__user_users_list_component__ = __webpack_require__(139);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__mainMenu_main_menu_component_main_menu_component_component__ = __webpack_require__(135);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__server_server_component__ = __webpack_require__(137);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__trip_component_trip_component_component__ = __webpack_require__(138);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__rules_rules_component__ = __webpack_require__(136);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__backoffice_backoffice_component__ = __webpack_require__(132);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__create_rules_create_rules_component__ = __webpack_require__(133);
/* unused harmony export routes */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return routing; });









// Route Configuration
var routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: __WEBPACK_IMPORTED_MODULE_1__login_login_component_component__["a" /* LoginComponentComponent */] },
    { path: 'users', component: __WEBPACK_IMPORTED_MODULE_2__user_users_list_component__["a" /* UsersListComponent */] },
    { path: 'mainmenu', component: __WEBPACK_IMPORTED_MODULE_3__mainMenu_main_menu_component_main_menu_component_component__["a" /* MainMenuComponentComponent */] },
    { path: 'servers', component: __WEBPACK_IMPORTED_MODULE_4__server_server_component__["a" /* ServerComponent */] },
    { path: 'trips', component: __WEBPACK_IMPORTED_MODULE_5__trip_component_trip_component_component__["a" /* TripComponentComponent */] },
    { path: 'rules', component: __WEBPACK_IMPORTED_MODULE_6__rules_rules_component__["a" /* RulesComponent */] },
    { path: 'business-users', component: __WEBPACK_IMPORTED_MODULE_7__backoffice_backoffice_component__["a" /* BackofficeComponent */] },
    { path: 'create-rules', component: __WEBPACK_IMPORTED_MODULE_8__create_rules_create_rules_component__["a" /* CreateRulesComponent */] }
];
var routing = __WEBPACK_IMPORTED_MODULE_0__angular_router__["a" /* RouterModule */].forRoot(routes);
//# sourceMappingURL=app.routes.js.map

/***/ }),

/***/ 162:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__urlvar__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BackofficeService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var BackofficeService = (function () {
    function BackofficeService(http) {
        this.http = http;
        this.buUrl = __WEBPACK_IMPORTED_MODULE_2__urlvar__["a" /* url */] + 'api/business-users';
    }
    BackofficeService.prototype.getUsers = function () {
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]();
        headers.append('Content-Type', 'application/json');
        var t = localStorage.getItem("token");
        headers.append("token", t);
        return (this.http.get(this.buUrl, { headers: headers })
            .toPromise()
            .then(function (response) { return response.json().users; })
            .catch(this.handleError));
    };
    BackofficeService.prototype.createUser = function (name, surname, username, password, role) {
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]();
        headers.append('Content-Type', 'application/json');
        var t = localStorage.getItem("token");
        headers.append("token", t);
        this.http.post(this.buUrl, { name: name, surname: surname, username: username, password: password, role: role }, { headers: headers })
            .toPromise()
            .then(function (response) { return response.json().user; })
            .catch(this.handleError);
    };
    BackofficeService.prototype.modifyUser = function (name, surname, username, password, role, _ref, id) {
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]();
        headers.append('Content-Type', 'application/json');
        var t = localStorage.getItem("token");
        headers.append("token", t);
        this.http.put(this.buUrl + '/' + id, { name: name, surname: surname, username: username, password: password, role: role, _ref: _ref }, { headers: headers })
            .toPromise()
            .then(function (response) { return response.json().user; })
            .catch(this.handleError);
    };
    BackofficeService.prototype.deleteUser = function (id) {
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]();
        headers.append('Content-Type', 'application/json');
        var t = localStorage.getItem("token");
        headers.append("token", t);
        this.http.delete(this.buUrl + '/' + id, { headers: headers })
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    BackofficeService.prototype.handleError = function (error) {
        var errMsg = (error.message) ? error.message :
            error.status ? error.status + " - " + error.statusText : 'Server error';
        console.error(errMsg); // log to console
        return Promise.reject(errMsg);
    };
    return BackofficeService;
}());
BackofficeService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["v" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* Http */]) === "function" && _a || Object])
], BackofficeService);

var _a;
//# sourceMappingURL=backoffice.service.js.map

/***/ }),

/***/ 163:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__urlvar__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CreaterulesService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var CreaterulesService = (function () {
    function CreaterulesService(http) {
        this.http = http;
        this.URL = __WEBPACK_IMPORTED_MODULE_2__urlvar__["a" /* url */] + 'api/rules';
    }
    CreaterulesService.prototype.createRule = function (ruleJson) {
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]();
        headers.append('Content-Type', 'application/json');
        var t = localStorage.getItem("token");
        headers.append("token", t);
        return this.http.post(this.URL, ruleJson, { headers: headers })
            .toPromise()
            .then(function (response) { return response.json().user; })
            .catch(this.handleError);
    };
    CreaterulesService.prototype.getRules = function () {
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]();
        headers.append('Content-Type', 'application/json');
        var t = localStorage.getItem("token");
        headers.append("token", t);
        return (this.http.get(this.URL, { headers: headers })
            .toPromise()
            .then(function (response) { return response.json().rules; })
            .catch(this.handleError));
    };
    CreaterulesService.prototype.deleteRule = function (id) {
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]();
        headers.append('Content-Type', 'application/json');
        var t = localStorage.getItem("token");
        headers.append("token", t);
        return (this.http.delete(this.URL + '/' + id, { headers: headers })
            .toPromise()
            .catch(this.handleError));
    };
    CreaterulesService.prototype.updateRule = function (id, language, active, _ref) {
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]();
        headers.append('Content-Type', 'application/json');
        var t = localStorage.getItem("token");
        headers.append("token", t);
        this.http.put(this.URL + '/' + id, { language: language, active: active, _ref: _ref }, { headers: headers })
            .toPromise()
            .then(function (response) { return response.json().rule; })
            .catch(this.handleError);
    };
    CreaterulesService.prototype.handleError = function (error) {
        var errMsg = (error.message) ? error.message :
            error.status ? error.status + " - " + error.statusText : 'Server error';
        console.error(errMsg); // log to console
        return Promise.reject(errMsg);
    };
    return CreaterulesService;
}());
CreaterulesService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["v" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* Http */]) === "function" && _a || Object])
], CreaterulesService);

var _a;
//# sourceMappingURL=createrules.service.js.map

/***/ }),

/***/ 164:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__urlvar__ = __webpack_require__(30);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginServiceService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var LoginServiceService = (function () {
    function LoginServiceService(http) {
        this.http = http;
        this.tokenURL = __WEBPACK_IMPORTED_MODULE_2__urlvar__["a" /* url */] + 'api/token';
    }
    LoginServiceService.prototype.getToken = function (userEntered, passEntered) {
        return (this.http.post(this.tokenURL, { username: userEntered, password: passEntered })
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(this.handleError));
    };
    LoginServiceService.prototype.handleError = function (error) {
        var errMsg = (error.message) ? error.message :
            error.status ? error.status + " - " + error.statusText : 'Server error';
        console.error(errMsg); // log to console
        return Promise.reject(errMsg);
    };
    return LoginServiceService;
}());
LoginServiceService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["v" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* Http */]) === "function" && _a || Object])
], LoginServiceService);

var _a;
//# sourceMappingURL=login-service.service.js.map

/***/ }),

/***/ 165:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__urlvar__ = __webpack_require__(30);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RulesService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var RulesService = (function () {
    function RulesService(http) {
        this.http = http;
        this.rulesURL = __WEBPACK_IMPORTED_MODULE_2__urlvar__["a" /* url */] + 'api/rules';
    }
    RulesService.prototype.getResult = function (factJson) {
        return (this.http.post(this.rulesURL + '/runall', factJson)
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(this.handleError));
    };
    RulesService.prototype.handleError = function (error) {
        var errMsg = (error.message) ? error.message :
            error.status ? error.status + " - " + error.statusText : 'Server error';
        console.error(errMsg); // log to console
        return Promise.reject(errMsg);
    };
    return RulesService;
}());
RulesService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["v" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* Http */]) === "function" && _a || Object])
], RulesService);

var _a;
//# sourceMappingURL=rules.service.js.map

/***/ }),

/***/ 166:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__urlvar__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ServerService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var ServerService = (function () {
    function ServerService(http) {
        this.http = http;
        this.serversURL = __WEBPACK_IMPORTED_MODULE_2__urlvar__["a" /* url */] + 'api/servers';
    }
    ServerService.prototype.getServers = function () {
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]();
        headers.append('Content-Type', 'application/json');
        var t = localStorage.getItem("token");
        headers.append("token", t);
        return (this.http.get(this.serversURL, { headers: headers })
            .toPromise()
            .then(function (response) { return response.json().servers; })
            .catch(this.handleError));
    };
    ServerService.prototype.createServer = function (serverName) {
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]();
        headers.append('Content-Type', 'application/json');
        var t = localStorage.getItem("token");
        headers.append("token", t);
        return (this.http.post(this.serversURL, { name: serverName }, { headers: headers })
            .toPromise()
            .then(function (response) { return response.json().server; })
            .catch(this.handleError));
    };
    ServerService.prototype.deleteServer = function (serverId) {
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]();
        headers.append('Content-Type', 'application/json');
        var t = localStorage.getItem("token");
        headers.append("token", t);
        this.http.delete('http://localhost:3000/api/servers/' + serverId, { headers: headers })
            .toPromise()
            .then(function (response) { return response.json().server; })
            .catch(this.handleError);
    };
    ServerService.prototype.handleError = function (error) {
        var errMsg = (error.message) ? error.message :
            error.status ? error.status + " - " + error.statusText : 'Server error';
        console.error(errMsg); // log to console
        return Promise.reject(errMsg);
    };
    return ServerService;
}());
ServerService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["v" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* Http */]) === "function" && _a || Object])
], ServerService);

var _a;
//# sourceMappingURL=server.service.js.map

/***/ }),

/***/ 167:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__urlvar__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TripServiceService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var TripServiceService = (function () {
    function TripServiceService(http) {
        this.http = http;
        this.tripsURL = __WEBPACK_IMPORTED_MODULE_2__urlvar__["a" /* url */] + 'api/users/';
        this.lastTripsURL = __WEBPACK_IMPORTED_MODULE_2__urlvar__["a" /* url */] + 'api/trips/lasttrips';
        this.tripsServersURL = __WEBPACK_IMPORTED_MODULE_2__urlvar__["a" /* url */] + 'api/servers/';
    }
    TripServiceService.prototype.getTrips = function (userId) {
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]();
        headers.append('Content-Type', 'application/json');
        var t = localStorage.getItem("token");
        headers.append("token", t);
        this.tripsURL = 'http://localhost:3000/api/users/';
        this.tripsURL = this.tripsURL + userId + '/trips';
        return (this.http.get(this.tripsURL, { headers: headers })
            .toPromise()
            .then(function (response) { return response.json().trips; })
            .catch(this.handleError));
    };
    TripServiceService.prototype.getLastTrips = function (numberOfTrips) {
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]();
        headers.append('Content-Type', 'application/json');
        var t = localStorage.getItem("token");
        headers.append("token", t);
        return (this.http.post(this.lastTripsURL, { numberOfTrips: numberOfTrips }, { headers: headers })
            .toPromise()
            .then(function (response) { return response.json().trips; })
            .catch(this.handleError));
    };
    TripServiceService.prototype.getAppserverTrips = function (serverId) {
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]();
        headers.append('Content-Type', 'application/json');
        var t = localStorage.getItem("token");
        headers.append("token", t);
        this.tripsServersURL = 'http://localhost:3000/api/servers/';
        this.tripsServersURL = this.tripsServersURL + serverId + '/trips';
        return (this.http.get(this.tripsServersURL, { headers: headers })
            .toPromise()
            .then(function (response) { return response.json().trips; })
            .catch(this.handleError));
    };
    TripServiceService.prototype.handleError = function (error) {
        var errMsg = (error.message) ? error.message :
            error.status ? error.status + " - " + error.statusText : 'Server error';
        console.error(errMsg); // log to console
        return Promise.reject(errMsg);
    };
    return TripServiceService;
}());
TripServiceService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["v" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* Http */]) === "function" && _a || Object])
], TripServiceService);

var _a;
//# sourceMappingURL=trip-service.service.js.map

/***/ }),

/***/ 168:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__urlvar__ = __webpack_require__(30);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UsersServiceService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var UsersServiceService = (function () {
    function UsersServiceService(http) {
        this.http = http;
        this.usersURL = __WEBPACK_IMPORTED_MODULE_2__urlvar__["a" /* url */] + 'api/users';
    }
    UsersServiceService.prototype.getAllUsers = function () {
        var token = localStorage.getItem('token');
        var opt;
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */];
        headers.set('Content-type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append("token", "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoidXNlciJ9.LSxbmkvdruuPEePOBfO6kdHISG_GTzt_EJK9B47Dhms");
        opt = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestOptions */]({
            headers: headers
        });
        return (this.http.get(this.usersURL, JSON.stringify({ headers: headers }))
            .toPromise()
            .then(function (response) { return response.json().users; })
            .catch(this.handleError));
    };
    UsersServiceService.prototype.getOneUser = function (userId) {
        var token = localStorage.getItem('token');
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]();
        headers.append('Content-type', 'application/json');
        var t = localStorage.getItem('token');
        headers.append("token", t);
        return (this.http.get(this.usersURL + '/' + userId, { headers: headers })
            .toPromise()
            .then(function (response) { return response.json().user; })
            .catch(this.handleError));
    };
    UsersServiceService.prototype.deleteUser = function (userId) {
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]();
        headers.append('Content-type', 'application/json');
        var t = localStorage.getItem('token');
        headers.append("token", t);
        this.http.delete(this.usersURL + '/' + userId, { headers: headers })
            .toPromise()
            .catch(this.handleError);
    };
    UsersServiceService.prototype.handleError = function (error) {
        var errMsg = (error.message) ? error.message :
            error.status ? error.status + " - " + error.statusText : 'Server error';
        console.error(errMsg); // log to console
        return Promise.reject(errMsg);
    };
    return UsersServiceService;
}());
UsersServiceService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["v" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* Http */]) === "function" && _a || Object])
], UsersServiceService);

var _a;
//# sourceMappingURL=users-service.service.js.map

/***/ }),

/***/ 169:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
var environment = {
    production: true
};
//# sourceMappingURL=environment.js.map

/***/ }),

/***/ 171:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(21)(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 172:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(21)(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 173:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(21)(false);
// imports


// module
exports.push([module.i, "h1{\n  color: blue;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 174:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(21)(false);
// imports


// module
exports.push([module.i, "h1 {\n  font-size: 500%;\n  text-align: center;\n  font: Monospace;\n  color: blue;\n}\n\n#titleBox{\n  color: blue;\n  font-size: 150%;\n}\n\n#box{\n    padding-top: 50px; \n    text-align: center;\n    font-size: 200;\n}\n\n#buttonContent {\n  text-align: center;\n}\n\n#button {\n  text-align: center;\n  color: blue;\n  background-color: lightblue;\n  font-size: 30px;\n  border-radius: 10px;\n}\n\n#error {\n  text-align: center;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 175:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(21)(false);
// imports


// module
exports.push([module.i, "#button {\n  background-color: white;\n  border-radius: 30px;\n  text-align: center;\n  font-size: 30px;\n  border-color: blue;\n}\n\nh1 {\n  text-align: center;\n  font-size: 50px;\n  color: lightblue;\n}\n\np {\n  text-align: center;\n}\n\nheader {\n  font-family: monospace;\n  font: arial;\n  font-size: 70px;\n  color: blue;\n  text-align: center;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 176:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(21)(false);
// imports


// module
exports.push([module.i, "#CostStyle{\n  font-size: 60px;\n  color: blue;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 177:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(21)(false);
// imports


// module
exports.push([module.i, "#serverBox {\n  color: blue;\n  border-radius: 20px;\n}\n\nh1 {\n  color: blue;\n  text-align: center;\n}\n\n.greencircle:before {\n  content: ' \\25CF';\n  font-size: 20px;\n  color: green;\n}\n\n.redcircle:before {\n  content: ' \\25CF';\n  font-size: 20px;\n  color: red;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 178:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(21)(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 179:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(21)(false);
// imports


// module
exports.push([module.i, "h1 {\n  color: blue;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 180:
/***/ (function(module, exports) {

module.exports = "<div class=\"container\">\n\n      <router-outlet></router-outlet>\n</div>\n"

/***/ }),

/***/ 181:
/***/ (function(module, exports) {

module.exports = "<div id=\"body\" class=\"row\">\n  <div class=\"col-md-5\">\n    <h1>Usuarios de negocio</h1>\n\n    <p id=\"box\">\n       <b id=\"titleBox\"> Nombre de usuario </b>  <br>\n        <input type=\"text\" [(ngModel)]=\"newUsername\" name=\"newUsername\" ><br>\n    </p>\n\n    <p id=\"box\">\n       <b id=\"titleBox\"> Password </b>  <br>\n        <input type=\"text\" [(ngModel)]=\"newPassword\" name=\"newPassword\" ><br>\n    </p>\n\n    <p id=\"box\">\n       <b id=\"titleBox\"> Nombre </b>  <br>\n        <input type=\"text\" [(ngModel)]=\"newName\" name=\"newName\" >   <button id=\"button\" (click)=\"createUser()\" type=\"button\">Nuevo Usuario</button> <br>\n    </p>\n\n    <p id=\"box\">\n       <b id=\"titleBox\"> Apellido </b>  <br>\n        <input type=\"text\" [(ngModel)]=\"newSurname\" name=\"newSurname\" >  <b style=\"color: red;\"> {{errorMessage}} </b> <br>\n    </p>\n\n    <p id=\"box\">\n       <b id=\"titleBox\"> Rol </b>  <br>\n        <input type=\"text\" [(ngModel)]=\"newRole\" name=\"newRole\" ><br>\n    </p>\n\n    <h2>Lista de usuarios</h2>\n    <ul class=\"list-group\">\n        <div id=\"userBox\" class=\"list-group-item\"\n          *ngFor=\"let user of users; let i = index\">\n          Id: <input type=\"text\" [(ngModel)]=\"users[i].id\" >  <button id=\"button\"  (click)=\"deleteUser(i)\" type=\"button\">Borrar</button> <button id=\"button\"  (click)=\"modifyUser(i)\" type=\"button\">Modificar</button> <br/>\n          Username: <input type=\"text\" [(ngModel)]=\"users[i].username\" ><br/>\n          Nombre : <input type=\"text\" [(ngModel)]=\"users[i].name\" ><br/>\n          Surname: <input type=\"text\" [(ngModel)]=\"users[i].surname\" ><br/>\n          role: <input type=\"text\" [(ngModel)]=\"users[i].role\" ><br/>\n        </div>\n    </ul>\n  </div>\n</div>\n"

/***/ }),

/***/ 182:
/***/ (function(module, exports) {

module.exports = "<h1 align=\"center\">\n  Crear regla\n</h1>\n\n<h3>Regla</h3>  <h3 align=\"right\"> <b> Ejemplo</b> </h3>\n<textarea  [(ngModel)]=\"blob\" rows=\"20\" cols=\"40\" > </textarea> <textarea style=\"float:right\" rows=\"20\" cols=\"40\" readonly>\n\t{\"priority\" : 6,\"name\": \"Balance negativo no puede viajar\", \"condition\": \"R.when(this && this.balance < 0);\",\"consequence\": \"this.tripOk = false; R.stop();\"}\n</textarea>\n<br/>\n<button (click)=\"crearRegla()\"> Crear regla</button>\n<br/>\n<br/>\n  <b>Variables que podes utilizar para crear la regla: </b> <br/>\n  <table style=\"width:100%\">\n    <tr>\n      <td>this.lastHour  </td>\n      <td>this.lastHalf </td>\n      <td>this.lastTen </td>\n      <td>this.paymethod </td>\n    </tr>\n  <tr>\n    <td>this.fecha </td>\n    <td>this.waitTime </td>\n    <td>this.travelTime </td>\n    <td>this.balance </td>\n  </tr>\n  <tr>\n    <td>this.passenger.totalTrips </td>\n    <td>this.passenger.lastHalf </td>\n    <td>this.passenger.lastTen</td>\n    <td>this.passenger.dailyTrips</td>\n  </tr>\n  <tr>\n    <td>this.driver.totalTrips</td>\n    <td>this.driver.lastHalf</td>\n    <td>this.driver.lastTen</td>\n    <td>this.passenger.dailyTrips</td>\n  </tr>\n  <tr>\n    <td>this.mail</td>\n  </tr>\n</table>\n<br/>\n\n\n<button (click)=\"getReglas()\"> Obtener reglas</button> <br/>\n\n<ul class=\"list-group\">\n    <div id=\"ruleBox\" class=\"list-group-item\"\n      *ngFor=\"let rule of rules; let i = index\">\n      Id: {{rule.id}}   <button id=\"button\"  (click)=\"deleteRegla(i)\" type=\"button\">Borrar</button> <br/>\n      activa:  <input type=\"text\" [(ngModel)]=\"rules[i].active\" > <button id=\"button\"  (click)=\"updateRegla(i)\" type=\"button\">Modificar</button>  <br/>\n      blob: {{rule.blob[0] | json}}<br/>\n      language: {{rule.language}} <br/>\n    </div>\n</ul>\n"

/***/ }),

/***/ 183:
/***/ (function(module, exports) {

module.exports = "  <form>\n    <h1>Llevame!</h1>\n    <p id=\"box\">\n       <b id=\"titleBox\"> Username </b>  <br>\n        <input type=\"text\" [(ngModel)]=\"user\" name=\"user\" ><br>\n    </p>\n    <p id=\"box\">\n       <b id=\"titleBox\"> Password </b>  <br>\n        <input type=\"password\" [(ngModel)]=\"password\" name=\"password\" ><br>\n    </p>\n    <p id=\"buttonContent\">\n     <button id=\"button\" (click)=\"action()\" type=\"button\">Iniciar sesion</button>\n   </p>\n          <div id=\"error\" *ngIf=\"loginError\" class=\"alert alert-danger\">{{loginError}}</div>\n  </form>\n"

/***/ }),

/***/ 184:
/***/ (function(module, exports) {

module.exports = "<div class=\"col-md-6 col-md-offset-3\">\n<header> llevame! </header>\n\n<h1>\n  Menu principal\n</h1>\n\n  <nav class=\"mdl-navigation\">\n\n    <p>\n        <button id=\"button\" type=\"button\" (click)=\"goToUsers()\" >\n            <a class=\"mdl-navigation__link\" [routerLink]=\"['/users']\">Users</a>\n        </button>\n    </p>\n        <br/>\n\n    <p>\n        <button id=\"button\" type=\"button\"  (click)=\"goToTrips()\" >\n            <a class=\"mdl-navigation__link\" [routerLink]=\"['/trips']\">Viajes</a>\n        </button>\n    </p>\n        <br/>\n\n    <p>\n        <button id=\"button\" type=\"button\" (click)=\"goToServers()\" >\n            <a class=\"mdl-navigation__link\" [routerLink]=\"['/servers']\">Estado actual</a>\n        </button>\n    </p>\n        <br/>\n      <!--\n    <p>\n        <button id=\"button\" type=\"button\" (click)=\"goToRules()\" >\n            <a class=\"mdl-navigation__link\" [routerLink]=\"['/rules']\">Reglas</a>\n        </button>\n    </p>\n  -->\n\n    <p>\n        <button id=\"button\" type=\"button\" (click)=\"goToBackofficeUsers()\" >\n            <a class=\"mdl-navigation__link\" [routerLink]=\"['/business-users']\">Usuarios de negocio</a>\n        </button>\n    </p>\n\n    <p>\n        <button id=\"button\" type=\"button\" (click)=\"goToCreateRule()\" >\n            <a class=\"mdl-navigation__link\" [routerLink]=\"['/create-rules']\">Crear regla</a>\n        </button>\n    </p>\n\n  </nav>\n\n    <router-outlet></router-outlet>\n</div>\n"

/***/ }),

/***/ 185:
/***/ (function(module, exports) {

module.exports = "<form>\n\n  <h1>Prueba de reglas</h1>\n  <p>\n    <b > Distancia </b>  <br>\n    <input type=\"number\" [(ngModel)]=\"distance\" name=\"distance\"><br>\n  </p>\n  <p>\n    <b> fecha </b>  <br>\n    <input type=\"number\" [(ngModel)]=\"fecha\" name=\"fecha\"><br>\n  </p>\n  <p>\n    <b> Cantidad de viajes propios en el dia </b>  <br>\n    <input type=\"number\" [(ngModel)]=\"ownDailyTrips\" name=\"ownDailyTrips\"><br>\n  </p>\n  <p>\n    <b > Cantidad total de viajes en los ultimos 30 minutos </b>  <br>\n    <input type=\"number\" [(ngModel)]=\"totalTrips\" name=\"totalTrips\"><br>\n  </p>\n  <p>\n    <b> Direccion de correo electronico </b>  <br>\n    <input type=\"text\" [(ngModel)]=\"mail\" name=\"mail\"><br>\n  </p>\n\n  <p>\n    <b> Balance del pasajero </b>  <br>\n    <input type=\"number\" [(ngModel)]=\"balance\" name=\"balance\"><br>\n  </p>\n\n  <p>\n    <b> Cantidad de viajes totales del pasajero </b>  <br>\n    <input type=\"number\" [(ngModel)]=\"cantViajes\" name=\"cantViajes\"><br>\n  </p>\n\n  <p>\n   <button (click)=\"calculateCost()\" type=\"button\">Calcular costo</button>\n </p>\n</form>\n\n<div id=\"CostStyle\">{{cost}}</div>\n\n<div >{{matchingRules}}</div>\n"

/***/ }),

/***/ 186:
/***/ (function(module, exports) {

module.exports = "<div id=\"body\" class=\"row\">\n  <div class=\"col-md-5\">\n    <h1>Servers</h1>\n    <h2> Crear server </h2>\n      <input type=\"text\" [(ngModel)]=\"serverName\" name=\"serverName\" ><br>\n      <button id=\"button\"  (click)=\"createServer()\" type=\"button\">Crear</button>\n    <h2>Estado actual</h2>\n    <ul class=\"list-group\">\n        <div id=\"serverBox\" class=\"list-group-item\"\n          *ngFor=\"let server of servers; let i = index\">\n          Nombre : {{server.name}} <button id=\"button\"  (click)=\"serverSelected(i)\" type=\"button\">Borrar</button> <br/>\n          Id: {{server.id}} <br/>\n          lastconnection: {{server.lastconnection}} <br/>\n          activo: {{server.activo}}\n        </div>\n    </ul>\n  </div>\n</div>\n"

/***/ }),

/***/ 187:
/***/ (function(module, exports) {

module.exports = "<div id=\"body\" class=\"row\">\n  <div class=\"col-md-5\">\n    <h1>Viajes</h1>\n    <p id=\"box\">\n       <b id=\"titleBox\"> Id del usuario: </b>  <br>\n        <input type=\"text\" [(ngModel)]=\"userId\" name=\"userId\" ><br>\n    </p>\n    <p id=\"buttonContent\">\n     <button id=\"button\" (click)=\"buscar()\" type=\"button\">Buscar por id de usuario</button>\n   </p>\n\n   <p id=\"buttonContent\">\n    <button id=\"button\" (click)=\"buscarPorAppserver()\" type=\"button\">Buscar por id del appServer</button>\n  </p>\n\n    <ul class=\"list-group\">\n        <div id=\"tripBox\" class=\"list-group-item\"\n          *ngFor=\"let trip of trips\">\n          <b>passenger</b> : {{trip.passenger}} <br/>\n          <b>driver</b> : {{trip.driver}} <br/>\n          <b>Id</b>: {{trip.id}} <br/>\n          <b>Currency</b>: {{trip.cost.currency}} <br/>\n          <b>Cost</b>: {{trip.cost.value}} <br/>\n          <b>Direccion de inicio</b>: {{trip.start.address.street}} <br/>\n          <b>Direccion de fin</b>: {{trip.end.address.street}} <br/>\n        </div>\n    </ul>\n\n\n    <h2> {{lastTripsMessage}} </h2>\n    <ul class=\"list-group\">\n        <div id=\"tripBox\" class=\"list-group-item\"\n          *ngFor=\"let lasttrip of lastTrips\">\n          <b>passenger</b> : {{lasttrip.passenger}} <br/>\n          <b>driver</b> : {{lasttrip.driver}} <br/>\n          <b>Id</b>: {{lasttrip.id}} <br/>\n          <b>Currency</b>: {{lasttrip.cost.currency}} <br/>\n          <b>Cost</b>: {{lasttrip.cost.value}} <br/>\n          <b>Direccion de inicio</b>: {{lasttrip.start.address.street}} <br/>\n          <b>Direccion de fin</b>: {{lasttrip.end.address.street}} <br/>\n        </div>\n    </ul>\n\n    <h2> {{serverTripsMessage}} </h2>\n    <ul class=\"list-group\">\n        <div id=\"tripBox\" class=\"list-group-item\"\n          *ngFor=\"let serverTrip of tripsFromServer\">\n          <b>passenger</b> : {{serverTrip.passenger}} <br/>\n          <b>driver</b> : {{serverTrip.driver}} <br/>\n          <b>Id</b>: {{serverTrip.id}} <br/>\n          <b>Currency</b>: {{serverTrip.cost.currency}} <br/>\n          <b>Cost</b>: {{serverTrip.cost.value}} <br/>\n          <b>Direccion de inicio</b>: {{serverTrip.start.address.street}} <br/>\n          <b>Direccion de fin</b>: {{serverTrip.end.address.street}} <br/>\n        </div>\n    </ul>\n\n  </div>\n</div>\n"

/***/ }),

/***/ 188:
/***/ (function(module, exports) {

module.exports = "\n  <h1> Llevame! </h1>\n\n<h2> Buscar usuario por id </h2>\n  <input type=\"text\" [(ngModel)]=\"userId\" name=\"userId\" ><br>\n  <button id=\"button\" (click)=\"buscarUser()\"  type=\"button\">Buscar</button>\n\n<div class=\"row\">\n  <div class=\"col-md-5\">\n    <h2>Usuarios de la aplicacion</h2>\n\n    <ul class=\"list-group\">\n      <li class=\"list-group-item\"\n        *ngFor=\"let user of users; let i = index\">\n        <b> Id:  </b> {{user.id}}  <button id=\"button\" (click)=\"deleteUser(i)\"  type=\"button\">Borrar</button> <br/>\n        <b> Nombre : </b> {{user.firstname}} <br/>\n        <b> Apellido:  </b> {{user.lastname}} <br/>\n        <b> Nombre de usuario:  </b> {{user.username}} <br/>\n        <b> Tipo:  </b> {{user.type}} <br/>\n        <b> Email:  </b> {{user.email}} <br/>\n        <b> Fecha de nacimiento:  </b> {{user.birthdate}} <br/>\n      </li>\n    </ul>\n  </div>\n</div>\n"

/***/ }),

/***/ 219:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(154);


/***/ }),

/***/ 30:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return url; });
var url = 'http://localhost:3000/';
//# sourceMappingURL=urlvar.js.map

/***/ }),

/***/ 64:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_es6_reflect__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_es6_reflect___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_core_js_es6_reflect__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_es7_reflect__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_es7_reflect___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_core_js_es7_reflect__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_zone_js_dist_zone__ = __webpack_require__(131);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_zone_js_dist_zone___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_zone_js_dist_zone__);
/**
 * This file includes polyfills needed by Angular and is loaded before the app.
 * You can add your own extra polyfills to this file.
 *
 * This file is divided into 2 sections:
 *   1. Browser polyfills. These are applied before loading ZoneJS and are sorted by browsers.
 *   2. Application imports. Files imported after ZoneJS that should be loaded before your main
 *      file.
 *
 * The current setup is for so-called "evergreen" browsers; the last versions of browsers that
 * automatically update themselves. This includes Safari >= 10, Chrome >= 55 (including Opera),
 * Edge >= 13 on the desktop, and iOS 10 and Chrome on mobile.
 *
 * Learn more in https://angular.io/docs/ts/latest/guide/browser-support.html
 */
/***************************************************************************************************
 * BROWSER POLYFILLS
 */
/** IE9, IE10 and IE11 requires all of the following polyfills. **/
// import 'core-js/es6/symbol';
// import 'core-js/es6/object';
// import 'core-js/es6/function';
// import 'core-js/es6/parse-int';
// import 'core-js/es6/parse-float';
// import 'core-js/es6/number';
// import 'core-js/es6/math';
// import 'core-js/es6/string';
// import 'core-js/es6/date';
// import 'core-js/es6/array';
// import 'core-js/es6/regexp';
// import 'core-js/es6/map';
// import 'core-js/es6/set';
/** IE10 and IE11 requires the following for NgClass support on SVG elements */
// import 'classlist.js';  // Run `npm install --save classlist.js`.
/** IE10 and IE11 requires the following to support `@angular/animation`. */
// import 'web-animations-js';  // Run `npm install --save web-animations-js`.
/** Evergreen browsers require these. **/


/** ALL Firefox browsers require the following to support `@angular/animation`. **/
// import 'web-animations-js';  // Run `npm install --save web-animations-js`.
/***************************************************************************************************
 * Zone JS is required by Angular itself.
 */
 // Included with Angular CLI.
/***************************************************************************************************
 * APPLICATION IMPORTS
 */
/**
 * Date, currency, decimal and percent pipes.
 * Needed for: All but Chrome, Firefox, Edge, IE11 and Safari 10
 */
// import 'intl';  // Run `npm install --save intl`.
//# sourceMappingURL=polyfills.js.map

/***/ })

},[219]);
//# sourceMappingURL=main.bundle.js.map