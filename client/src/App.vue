<template>
  <div id="app" class="container">
    <a class="text-center text-light mt-2 ms-2" data-bs-toggle="modal" data-bs-target="#modalDebug">DEBUG</a>
    <div class="row" v-if="!user.authenticated">
      <div class="col-12">
        <form class="card" v-on:submit.prevent="handleLoginSubmit">
          <div class="card-body shadow-sm">
            <div class="mb-3">
              <label>Email</label>
              <input class="form-control" required type="email" v-model="user.email" placeholder="email@email.com">
            </div>
            <div class="mb-3">
              <label>Senha</label>
              <input class="form-control" required type="password" v-model="user.password" placeholder="Senha">
            </div>
            <button class="mb-3 btn btn-primary me-3">Entrar</button>
            <button class="mb-3 btn btn-outline-primary" type="button" data-bs-toggle="modal" data-bs-target="#modalRegister">Criar Conta</button>
          </div>
        </form>
      </div>
    </div>

    <div class="row" v-else v-show="user.status == 'idle'">
      <div class="col-12 text-white">
        <div class="d-flex justify-content-start align-items-center flex-row mb-3">
          <HomeUnit
          v-for="(unit, unitIndex) in defaultUnitTypes"
          :key="`table_type_unit_${unitIndex}`"
          :index="unitIndex" 
          :owned="user.data.unlockedTypes.includes(unit.name)"
          :attack="unit.attributes.attack.curr"
          :attackProgress="unit.attributes.attack.progress"
          :deffense="unit.attributes.deffense.curr"
          :deffenseProgress="unit.attributes.deffense.progress"
          :healthCurr="unit.attributes.health.curr"
          :healthMax="unit.attributes.health.max"
          :price="unit.unlockPrice"
          :tier="unit.attributes.tier.curr"
          :type="unit.name"
          :unlockPrice="unit.unlockPrice"
          :selected="user.data.selectedTypes.includes(unit.name)"
          v-on:handleSelectUnit="(unitName) => { handleSelectUnit(unitName) }"
          v-on:handleUnlockUnit="(unitName) => { handleUnlockUnit(unitName) }"
          :description="unit.description"/>
        </div>
        <div class="row mb-3">
          <div class="col-12">
            <div class="card">
              <div class="card-body shadow-sm">
                <div class="d-flex justify-content-between align-items-center flex-row">
                  <div class="ms-3">
                    <h2 class="text-dark text-start align-items-center d-flex flex-row" >
                      {{user.data.username || 'Sem nome'}}
                      <small class="ms-2 fs-5 px-3 py-2 rounded-pill border text-muted"><font-awesome-icon class="me-2" size="1x" icon="circle-chevron-up" />{{user.data.rank}}</small>  
                    </h2>
                    <h3 class="mb-0 text-muted text-start" >{{user.data.gold}} <font-awesome-icon class="ms-2" size="1x" icon="coins" /></h3>
                  </div>
                  <div>
                    <button class="btn btn-primary w-100" :disabled="user.data.selectedTypes.length < 2" v-on:click="handleSearchClick">Procurar partida <font-awesome-icon class="ms-2" size="1x" icon="magnifying-glass" /></button>
                    <button class="btn btn-outline-danger mt-3 w-100" v-on:click="handleExitClick">Sair <font-awesome-icon class="ms-2" size="1x" icon="xmark" /></button>
                  </div>
                </div>
                <small class="text-primary" v-if="user.data.selectedTypes.length < 2"><i> Selecione ao menos <b>2 tipos de unidade</b> para jogar</i></small>
                <small class="text-primary" v-else><i>Clique em <b>Procurar partida</b> para encontrar um oponente.</i></small>
              </div>
            </div>
            <p class="text-center text-light mt-2">Socket instance <i>#{{socketId}}</i></p>
          </div>
        </div>
      </div>
    </div>

    <div class="modal modal-fade" id="modalRegister">
      <div class="modal-dialog">
        <form class="modal-content" v-on:submit.prevent="handleRegisterSubmit">
          <div class="modal-header">
            <h5 class="modal-title">Cria conta</h5>
            <button ref="closeModal" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label>Usuário</label>
              <input class="form-control" required type="text" v-model="register.username" placeholder="Usuário">
            </div>
            <div class="mb-3">
              <label>Email</label>
              <input class="form-control" required type="email" v-model="register.email" placeholder="email@email.com">
            </div>
            <div class="mb-3">
              <label>Senha</label>
              <input class="form-control" required type="password" v-model="register.password" placeholder="Senha">
            </div>
            <div class="mb-3">
              <label>Confirmar Senha</label>
              <input class="form-control" required type="password" v-model="register.passwordConfirm" placeholder="Confirmar senha">
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary">
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="modal modal-fade" id="modalDebug">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Dados da aplicação</h5>
            <button ref="closeModal" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body text-start">
            <pre>
{{JSON.stringify($data, null, 2)}}
            </pre>
          </div>
        </div>
      </div>
    </div>

    <div class="row" v-show="user.status == 'searching'">
      <div class="col-12 mt-5">
        <div class="spinner-border text-light mb-3" style="width: 3rem; height: 3rem;"  role="status">
          <span class="visually-hidden">Procurando partida...</span>
        </div>
        <h2 class="text-light">Procurando partida...</h2>
        <button class="btn btn-outline-light" v-on:click="handleSearchClick">Cancelar</button>
      </div>
    </div>

    <div class="row justify-content-center" v-if="tables.length > 0 && (user.status != 'won' && user.status !='defeat')">
      <Table
      :gold="0"
      :life="oponentTable.life"
      :socketId="socketId"
      :userId="oponentTable.userId"
      :tableIndex="0"
      :rank="0"
      :userName="oponentTable.userName"
      :unitList="oponentTable.unitList"
      :enemyList="oponentTable.enemyList"
      :owned="false"
      :unitPrice="oponentTable.unitPrice"
      :hideUnitImages="true"
      />
      <Table
      :gold="userTable.gold"
      :life="userTable.life"
      :socketId="socketId"
      :userId="userTable.userId"
      :tableIndex="1"
      :userName="user.data.username"
      :unitList="userTable.unitList"
      :enemyList="userTable.enemyList"
      :owned="true"
      :unitPrice="userTable.unitPrice"
      :hideUnitImages="false"
      :rank="user.data.rank"
      v-on:handleUnitAddClick="handleUnitAddClick"
      v-on:handleUpgradeUnit="handleUpgradeUnit"
      />
    </div>

    <div class="row justify-content-center" v-show="user.status == 'won' || user.status == 'defeat'">
      <div class="col mt-5">
        <div class="card">
          <div class="card-body">
            <h2 class="mb-3" v-if="user.status == 'won'">Você venceu com:</h2>
            <h2 class="mb-3" v-else>Você perdeu para:</h2>
              <div class="d-flex justify-content-start align-items-center flex-row mb-3" v-if="user.status == 'won'">
                <TableUnit
                  v-for="(unit, unitIndex) in userTable.unitList"
                  :key="`result_unit_${unitIndex}`"
                  :index="unitIndex"
                  :type="unit.type"
                  :tier="unit.attributes.tier.curr"
                  :healthCurr="unit.attributes.health.curr"
                  :healthMax="unit.attributes.health.max"
                  :attack="unit.attributes.attack.curr"
                  :deffense="unit.attributes.deffense.curr"
                  :owned="true"
                  :price="unit.price"
                />
              </div>
              <div class="d-flex justify-content-start align-items-center flex-row mb-3" v-if="user.status == 'defeat'">
                <TableUnit
                  v-for="(unit, unitIndex) in oponentTable.unitList"
                  :key="`result_unit_${unitIndex}`"
                  :index="unitIndex"
                  :type="unit.type"
                  :tier="unit.attributes.tier.curr"
                  :healthCurr="unit.attributes.health.curr"
                  :healthMax="unit.attributes.health.max"
                  :attack="unit.attributes.attack.curr"
                  :deffense="unit.attributes.deffense.curr"
                  :owned="true"
                  :price="unit.price"
                />
              </div>
            <button class="btn btn-primary" v-on:click="handleEndContinueClick">Continuar</button>
          </div>
        </div>
      </div>
    </div>

    <div class="position-fixed d-flex justify-content-center align-items-center start-0 end-0 top-0 p-3" style="z-index: 1061">
      <BsToast ref="bsToast"/>
    </div>
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import Table from './components/Table.vue'
import HomeUnit from './components/HomeUnit.vue'
import TableUnit from './components/TableUnit.vue'
import BsToast from './components/BsToast.vue'

export default {
  name: 'App',
  components: {
    Table,
    HomeUnit,
    TableUnit,
    BsToast
  },
  data: () => ({
    socketId: '',
    attempLocalLogin: false,
    register: {
      username:         '',
      email:            '',
      password:         '',
      passwordConfirm:  '',
    },
    user:           {
      email:          '',
      password:       '',
      data:           {},
      authenticated:  false,
      status:         'login',
    },
    defaultUnitTypes: [],
    tables: [],
  }),
  computed: {
    userTable() {
      return this.tables.find(table => table.socketId == this.socketId);
    },
    oponentTable() {
      return this.tables.find(table => table.socketId != this.socketId);
    }
  },
  mounted() {
    this.socketId = this.$socket.id;
    const localEmail = localStorage.getItem('email');
    const localPassword = localStorage.getItem('password');
    if(localEmail && localPassword) {
      this.user.email = localEmail;
      this.user.password = localPassword;
      this.attempLocalLogin = true;
    }
  },
  sockets: {
    connect: function() {
      this.socketId = this.$socket.id;
      if(this.attempLocalLogin) {
        this.handleLoginSubmit();
      }
    },
    SERVER_ERROR: function(data) {
      const { error } = data;
      this.toastAlert(error.error, error.message);
    },
    SERVER_REGISTER_SUCCESS: function() {
      this.toastAlert('Sucesso!', 'Conta criada com sucesso!');
      this.$refs.closeModal.click();
      this.register = {
        username:         '',
        email:            '',
        password:         '',
        passwordConfirm:  '',
      };
    },
    SERVER_LOGIN_SUCCESS: function(data) {
      const { userData, defaultUnitTypes } = data;
      this.defaultUnitTypes = defaultUnitTypes.unitTypes;
      this.user.data = userData;
      this.user.authenticated = true;
      this.user.status = 'idle';
      localStorage.setItem('email', this.user.email);
      localStorage.setItem('password', this.user.password);
    },
    SERVER_SELECTED_UNIT_TYPES: function(data) {
      const { selectedTypes } = data;
      this.toastAlert('Grupo', selectedTypes.length ? selectedTypes.join(', ') : 'Nenhuma unidade selecionada');
      this.user.data.selectedTypes = selectedTypes;
    },
    SERVER_UNLOCKED_UNIT_TYPES: function(data) {
      const { unlockedTypes, gold } = data;
      this.toastAlert('Unidades Desbloqueadas', unlockedTypes.length ? unlockedTypes.join(', ') : 'Nenhuma unidade desbloqueada');
      this.user.data.unlockedTypes = unlockedTypes;
      this.user.data.gold = gold;
    },
    SERVER_MATCH_INIT: function(data) {
      const { tables } = data;
      this.user.status = 'playing';
      this.tables = tables;
    },
    SERVER_MATCH_CYCLE: function(data) {
      const { tables } = data;
      tables.forEach((table, tableIndex) => {
        table.forEach(eventRef => {
          this.handleEvent(tableIndex, eventRef);
        })
      });
    },
    SERVER_MATCH_END: function(data) {
      const { won, gold } = data;
      this.user.status = won ? 'won' : 'defeat';
      this.user.data.gold = gold;
    },
  },
  methods: {
    toastAlert(title, message) {
      this.$refs.bsToast.show(title, message);
    },
    handleEvent(tableIndex, eventRef) {
      const event = {...eventRef};
      var health;
      switch(event.type) {
          case 'unit':
              health = Array.isArray(event.data) ? event.data[event.data.length-1].health : event.data.health;
              if(event.targetIndex == 'user') {
                  this.tables[tableIndex].life = health;
              }else if(this.tables[tableIndex].enemyList[event.targetIndex]){
                this.tables[tableIndex].enemyList[event.targetIndex].attributes.health.curr = health;
                if(health <= 0) {
                  this.tables[tableIndex].enemyList.splice(event.targetIndex, 1);
                }
              }
          break;
          case 'enemy':
              health = Array.isArray(event.data) ? event.data[event.data.length-1].health : event.data.health;
              if(event.targetIndex == 'user') {
                  this.tables[tableIndex].life = health;
              }else if(this.tables[tableIndex].unitList[event.targetIndex]){
                this.tables[tableIndex].unitList[event.targetIndex].attributes.health.curr = health;
                if(health <= 0) {
                  this.tables[tableIndex].unitList[event.targetIndex].attributes.health.curr = 0;
                  setTimeout(() => {
                    this.tables[tableIndex].unitList.splice(event.targetIndex, 1);
                  });
                }
              }
          break;
          case 'enemyDied':
            var gold = event.data.gold;
            this.tables[tableIndex].gold = gold;
          break;
          case 'addUnit':
              this.tables[tableIndex].unitList.push(event.data.newUnit);
              this.tables[tableIndex].gold = event.data.gold;
              this.tables[tableIndex].unitPrice = event.data.unitPrice;
          break;
          case 'addEnemy':
              this.tables[tableIndex].enemyList.push(event.data)
          break;
          case 'upgradeUnit':
              this.tables[tableIndex].unitList[event.index] = event.data.newUnit;
              this.tables[tableIndex].gold = event.data.gold;
          break;
      }
    },
    handleRegisterSubmit() {
      this.$socket.emit('CLIENT_REGISTER', { username: this.register.username, email: this.register.email, password: this.register.password });
    },
    handleLoginSubmit() {
      this.$socket.emit('CLIENT_LOGIN', { email: this.user.email, password: this.user.password });
    },
    handleUnlockUnit(unitTypeName) {
      this.$socket.emit('CLIENT_UNLOCK_UNIT_TYPE', { unitTypeName });
    },
    handleSelectUnit(unitTypeName) {
      this.$socket.emit('CLIENT_SELECT_UNIT_TYPE', { unitTypeName });
    },
    handleSearchClick() {
      switch(this.user.status) { 
        case 'idle':
          this.user.status = 'searching';
          this.$socket.emit('CLIENT_SEARCH');
        break;
        case 'searching':
          this.user.status = 'idle';
          this.$socket.emit('CLIENT_SEARCH_STOP');
        break;
      }
    },
    handleUnitAddClick() {
      this.$socket.emit('CLIENT_MATCH_UNIT_ADD');
    },
    handleUpgradeUnit(unitIndex) {
      this.$socket.emit('CLIENT_MATCH_UNIT_UPGRADE', { index: unitIndex });
    },
    handleExitClick() {
      if(confirm('Você realmente deseja sair da sua conta?')) {
        this.$socket.emit('CLIENT_LOGOFF');
        this.tables = [];
        this.user = {
          username:       '',
          password:       '',
          data:           {},
          authenticated:  false,
          status:         'login',
        };
      }
    },
    handleEndContinueClick() {
      this.tables = [];
      this.user.status = 'idle';
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

img {
  width: 50px;
  height: 50px;
  image-rendering: pixelated;
}
</style>
