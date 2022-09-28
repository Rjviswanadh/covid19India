const Express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
let path = require("path");
const dbPath = path.join(__dirname, "covid19India.db");
let db = null;
let path1 = 5000;

const app = Express();
app.use(Express.json());
const getDataBase = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(path1, () => {
      console.log(`server running at ${path1}`);
    });
  } catch (e) {
    console.log("plz check what is wrong");
  }
};
getDataBase();

module.exports = Express;
// GET STATES
app.get("/states/", async (request, response) => {
  const getAll = `select state_id as "stateId",state_name as "stateName",population as "population" from state`;
  let dbGetAll = await db.all(getAll);
  response.send(dbGetAll);
});
//GET WITH NUMBER
app.get("/states/:stateId/", async (request, response) => {
  const { stateId } = request.params;
  const getOne = `select state_id as "stateId",state_name as "stateName",population as "population" from state where state_id=${stateId}`;
  let dbGetOne = await db.get(getOne);
  response.send(dbGetOne);
});

//post
app.post("/districts/", async (request, response) => {
  const { districtName, stateId, cases, cured, active, deaths } = request.body;
  const getOne = `insert into district (district_name ,state_id,cases,cured,active,deaths) 
  values ("${districtName}","${stateId}","${cases}",
  "${cured}","${active}","${deaths}")`;
  let dbPostOne = await db.run(getOne);
  response.send("District Successfully Added");
});

//GET DISTRICTNMAES
app.get("/districts/:districtId/", async (request, response) => {
  const { districtId } = request.params;
  const getAllDis = `select district_id as districtId,district_name as districtName,state_id as stateId,cases,cured,active,deaths from district where district_id=${districtId}`;
  let dbGetAllDis = await db.get(getAllDis);
  response.send(dbGetAllDis);
});

app.delete("/districts/:districtId/", async (request, response) => {
  const { districtId } = request.params;
  const getOneDel = `delete from district where district_id=${districtId}`;
  let dbGetOneDel = await db.get(getOneDel);
  response.send("District Removed");
});

//update the table
app.put("/districts/:districtId/", async (request, response) => {
  const { districtId } = request.params;
  const { districtName, stateId, cases, cured, active, deaths } = request.body;
  const updateOne = `update district set district_name="${districtName}",state_id= "${stateId}",cases= "${cases}",
  cured= "${cured}",active= "${active}",deaths= "${deaths}"
   where district_id = ${districtId}`;
  let dbGetOneUpdate = await db.run(updateOne);
  response.send("District Details Updated");
});

app.get("/states/:stateId/stats/", async (request, response) => {
  const { stateId } = request.params;
  const sumOf = `select sum(cases) as totalCases from district where state_id = ${stateId}
  `;
  const dbSumOf = await db.get(sumOf);
  response.send(dbSumOf);
});

app.get("/districts/:stateId/details", async (request, response) => {
  const { stateId } = request.params;
  const dis = `select state_name as stateName from state where state_id = "${stateId}" `;
  const dbDis = await db.get(dis);
  response.send(dbDis);
});
