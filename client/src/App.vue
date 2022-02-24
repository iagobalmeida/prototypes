<template>
  <div id="app" class="container">
    <div class="row" v-if="!user.authenticated">
      <div class="col-12">
        <form class="card" v-on:submit.prevent="handleLoginSubmit">
          <div class="card-body shadow-sm">
            <div class="mb-3">
              <label>Usuário</label>
              <input class="form-control" type="text" v-model="user.username" placeholder="Usuario">
            </div>
            <div class="mb-3">
              <label>Senha</label>
              <input class="form-control" type="password" v-model="user.password" placeholder="Senha">
            </div>
            <button class="mb-3 btn btn-primary">Entrar</button>
          </div>
        </form>
      </div>
    </div>

    <div class="row" v-else v-show="user.status == 'idle'">
      <div class="col-12 text-white">
        <div class="d-flex justify-content-start align-items-center flex-row mb-3">
          <HomeUnit
          v-for="(unit, unitIndex) in user.data.unitTypes"
          :key="`table_type_unit_${unitIndex}`"
          :index="unitIndex" 
          :owned="false"
          :attack="unit.attributes.attack.curr"
          :deffense="unit.attributes.deffense.curr"
          :healthCurr="unit.attributes.health.curr"
          :healthMax="unit.attributes.health.max"
          :price="unit.price"
          :tier="unit.attributes.tier.curr"
          :type="unit.name"
          :selected="user.data.selectedUnitTypes.includes(unit.name)"
          v-on:handleSelectUnit="(unitName) => { handleSelectUnit(unitName) }"
          :description="unit.description"/>
        </div>
        <div class="row mb-3">
          <div class="col-12">
            <div class="card">
              <div class="card-body shadow-sm d-flex justify-content-between align-items-center flex-row">
                <div class="ms-3">
                  <h2 class="mb-0 text-dark text-start" >{{user.data.username || 'Sem nome'}}</h2>
                  <h3 class="mb-0 text-muted text-start" >{{user.data.gold}} <font-awesome-icon class="ms-2" size="1x" icon="coins" /></h3>
                </div>
                <div>
                  <button class="btn btn-primary w-100 mb-3" v-on:click="handleSearchClick">Procurar partida <font-awesome-icon class="ms-2" size="1x" icon="magnifying-glass" /></button>
                  <button class="btn btn-outline-danger w-100" v-on:click="handleExitClick">Sair <font-awesome-icon class="ms-2" size="1x" icon="xmark" /></button>
                </div>

              </div>
            </div>
            <p class="text-center text-light mt-2">Socket instance <i>#{{socketId}}</i></p>
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

    <div class="row justify-content-center" v-if="tables.length > 0 && (user.status != 'won' && user.status !='lost')">
      <Table
      :gold="oponentTable.gold"
      :life="oponentTable.life"
      :socketId="socketId"
      :userId="oponentTable.userId"
      :tableIndex="0"
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
      :userName="userTable.userName"
      :unitList="userTable.unitList"
      :enemyList="userTable.enemyList"
      :owned="true"
      :unitPrice="userTable.unitPrice"
      :hideUnitImages="false"
      v-on:handleUnitAddClick="handleUnitAddClick"
      v-on:handleUpgradeUnit="handleUpgradeUnit"
      />
    </div>

    <div class="row justify-content-center" v-show="user.status == 'won' || user.status == 'lost'">
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
              <div class="d-flex justify-content-start align-items-center flex-row mb-3" v-if="user.status == 'lost'">
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

    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import Table from './components/Table.vue'
import HomeUnit from './components/HomeUnit.vue'
import TableUnit from './components/TableUnit.vue'

export default {
  name: 'App',
  components: {
    Table,
    HomeUnit,
    TableUnit
  },
  data: () => ({
    socketId: '',
    user:           {
      username:       '',
      password:       '',
      data:           {},
      authenticated:  false,
      status:         'login',
    },
    tables: [],
  }),
  computed: {
    userTable() {
      return this.tables.find(table => table.userId == this.socketId);
    },
    oponentTable() {
      return this.tables.find(table => table.userId != this.socketId);
    }
  },
  mounted() {
    this.socketId = this.$socket.id;
  },
  sockets: {
    connect: function() {
      this.socketId = this.$socket.id;
    },
    SERVER_LOGIN_SUCCESS: function(data) {
      const { userData } = data;
      this.user.data = userData;
      this.user.authenticated = true;
      this.user.status = 'idle';
    },
    SERVER_SELECTED_UNIT_TYPES: function(data) {
      const { selectedUnitTypes } = data;
      this.user.data.selectedUnitTypes = selectedUnitTypes;
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
    SERVER_MATCH_END: function(/*data*/) {
      // const { tables } = data;
      // const userTable = tables.find(table => table.userId == this.socketId);
      // const otherTable = tables.find(table => table.userId != this.socketId);
      // alert(`Sua vida final: ${userTable.life} \n Vida do ponente: ${otherTable.life}`)
      this.user.status = this.userTable.life >= this.oponentTable.life ? 'won' : 'lost';
    },
  },
  methods: {
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
    handleLoginSubmit() {
      this.$socket.emit('CLIENT_LOGIN', { username: this.user.username, password: this.user.password });
    },
    handleSelectUnit(unitTypeName) {
      console.log(unitTypeName);
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
