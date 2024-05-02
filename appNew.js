const express = require("express");
const app = express();
const { Pool } = require("pg");
const cors = require('cors');
app.use(cors());


const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "aic",
    password: "Mrok@6781",
    port: 5432, // Default PostgreSQL port
});

app.get("/getPageData",async(req,res)=>{
    const pageId = req.query.pageId;

    if(pageId == 1000000002){

        const details = `SELECT 
        Cell."Row" AS "Row ID", MAX(Cell."Col") AS "Col ID",
        json_agg(
            json_build_object(
                'Cell', Cell."Cell",
                'Item', Item."Item",
                'JSON', Item."JSON",
                'ColID',Cell."Col"
            )
        ) AS "Merged Data"
    FROM 
        public."t-Cell" Cell
    INNER JOIN 
        public."t-Item" Item ON Item."Item" = ANY(Cell."Items")
    INNER JOIN 
        public."t-Row" Row ON Cell."Row" = Row."Row"
        Where Row."PG" = ${pageId}
    GROUP BY 
        Cell."Row"
    ORDER BY 
        "Row ID" ASC
        limit 1000`;
    
        const result = await pool.query(details);
        const resultData = result.rows;
        let columnObj = {};
        const rowDetails = [];
        resultData[0]
        for (let i = 0; i < resultData.length; i++) {
            let mergedData = resultData[i]['Merged Data'];
            if(mergedData.length == 1){
            columnObj[mergedData[0].ColID] = mergedData[0].JSON ;
            }else{
                rowDetails.push(resultData[i])
            }
        }
    
        console.log("columnObj", columnObj);
    
        const data = rowDetails;
        const finalResult = [];
        for(let i=0;i<data.length;i++){
            let mergedData = data[i]['Merged Data'];
            let obj={};
            obj['Row ID']=data[i]['Row ID'];
            for(let j=0;j<mergedData.length;j++){
                obj['Row ID']=data[i]['Row ID'];
                obj[columnObj[mergedData[j]['ColID']]] = mergedData[j]['JSON']
            }
            finalResult.push(obj);
        }
        res.json(finalResult);    
    }else{
    const details = `SELECT 
    Cell."Row" AS "Row ID", MAX(Cell."Col") AS "Col ID",
    json_agg(
        json_build_object(
            'Cell', Cell."Cell",
            'Item', Item."Item",
            'JSON', Item."JSON",
            'ColID',Cell."Col"
        )
    ) AS "Merged Data"
FROM 
    public."t-Cell" Cell
INNER JOIN 
    public."t-Item" Item ON Item."Item" = ANY(Cell."Items")
INNER JOIN 
    public."t-Row" Row ON Cell."Row" = Row."Row"
	Where Row."PG" = ${pageId}
GROUP BY 
    Cell."Row"
ORDER BY 
    "Row ID" ASC`;

    const result = await pool.query(details);
    const resultData = result.rows;
    let columnObj = {};
    const rowDetails = [];
    for (let i = 0; i < resultData.length; i++) {
        let mergedData = resultData[i]['Merged Data'];
        if(mergedData.length == 1){
        columnObj[mergedData[0].ColID] = mergedData[0].JSON ;
        }else{
            rowDetails.push(resultData[i])
        }
    }

    console.log("columnObj*", columnObj);

    const data = rowDetails;
    console.log('data*',data[0])
    const finalResult = [];
    for(let i=0;i<data.length;i++){
        let mergedData = data[i]['Merged Data'];
        let obj={};
        obj['Row ID']=data[i]['Row ID'];
        for(let j=0;j<mergedData.length;j++){
            obj['Row ID']=data[i]['Row ID'];
            obj[columnObj[mergedData[j]['ColID']]] = mergedData[j]['JSON']
        }
        finalResult.push(obj);
    }
    res.json(finalResult);
}
})

app.get("/getAllPages",async(req,res)=>{
    const pgDetailsQuery =`select * from public."t-PG" limit 1`;
    const pgData = await pool.query(pgDetailsQuery);
    const pageId = pgData.rows[0].PG;
    const details = `SELECT 
    Cell."Row" AS "Row ID", MAX(Cell."Col") AS "Col ID",
    json_agg(
        json_build_object(
            'Cell', Cell."Cell",
            'Item', Item."Item",
            'JSON', Item."JSON",
            'ColID',Cell."Col"
        )
    ) AS "Merged Data"
FROM 
    public."t-Cell" Cell
INNER JOIN 
    public."t-Item" Item ON Item."Item" = ANY(Cell."Items")
INNER JOIN 
    public."t-Row" Row ON Cell."Row" = Row."Row"
	Where Row."PG" = ${pageId}
GROUP BY 
    Cell."Row"
ORDER BY 
    "Row ID" ASC
LIMIT 200`;

    const result = await pool.query(details);
    const resultData = result.rows;
    let columnObj = {};
    const rowDetails = [];
    for (let i = 0; i < resultData.length; i++) {
        let mergedData = resultData[i]['Merged Data'];
        if(mergedData.length == 1){
        columnObj[mergedData[0].ColID] = mergedData[0].JSON ;
        }else{
            rowDetails.push(resultData[i])
        }
    }

    const data = rowDetails;
    const finalResult = [];

    for(let i=0;i<data.length;i++){
        let mergedData = data[i]['Merged Data'];
        let obj={};
        obj['Row ID']=data[i]['Row ID'];
        for(let j=0;j<mergedData.length;j++){
            obj['Row ID']=data[i]['Row ID'];
            obj[columnObj[mergedData[j]['ColID']]] = mergedData[j]['JSON']
        }
        finalResult.push(obj);
    }
    res.json(finalResult);
})

app.post("/insertPages", async (req, res) => {


    let data = [
        {
            "Page Name": "All Pages",
            "Page Type": "Page List",
            "Page Edition": "Default",
            "Page Owner": "Admin",
            "Page URL": "URL to open this Page",
            "Page SEO": "'PG'; 'Page'; 'Pages'",
            "Page Status": "System",
            "Page Comment ":
                "Page:  Listing of all Pages in the system.  Said Page is displayed in the AllPage-dialog.",
            "Row Type": "PG-Row",
            "Row Status": "System",
        },
        {
            "Page Name": "All Cols",
            "Page Type": "",
            "Page Edition": "Default",
            "Page Owner": "Admin",
            "Page URL": "URL to open this Page",
            "Page SEO": "'Col'; 'Cols'; 'Column'",
            "Page Status": "System",
            "Page Comment ":
                "Page:  Listing of all Cols in the system.  Said Page is displayed in the AllCol-dialog.",
            "Row Type": "PG-Row",
            "Row Status": "System",
        },
        {
            "Page Name": "All Profiles",
            "Page Type": "",
            "Page Edition": "Default",
            "Page Owner": "Admin",
            "Page URL": "URL to open this Page",
            "Page SEO": "'All Profiles'",
            "Page Status": "System; Missing Data",
            "Page Comment ":
                "Page:  All Profiles in the system.  Said Page is displayed in the AllProfile-dialog.",
            "Row Type": "PG-Row",
            "Row Status": "System",
        },
        {
            "Page Name": "All Users",
            "Page Type": "",
            "Page Edition": "Default",
            "Page Owner": "Admin",
            "Page URL": "URL to open this Page",
            "Page SEO": "'All Users'",
            "Page Status": "System",
            "Page Comment ":
                "Page:  Listing of all Users in the system.  Said Page is displayed in the AllUser-dialog.",
            "Row Type": "PG-Row",
            "Row Status": "System",
        },
        {
            "Page Name": "All Categories",
            "Page Type": "Page List",
            "Page Edition": "Default",
            "Page Owner": "Admin",
            "Page URL": "URL to open this Page",
            "Page SEO": "'All Categories'",
            "Page Status": "System",
            "Page Comment ":
                "Page:  Listing of all Category Page's in the system.  Said Page is displayed in the AllCategory-dialog.",
            "Row Type": "PG-Row",
            "Row Status": "System",
        },
        {
            "Page Name": "All Products",
            "Page Type": "Page List",
            "Page Edition": "Default",
            "Page Owner": "Admin",
            "Page URL": "URL to open this Page",
            "Page SEO": "'All Products'",
            "Page Status": "System",
            "Page Comment ":
                "Page:  Listing of all Product Page's in the system.  Said Page is displayed in the AllProduct-dialog.",
            "Row Type": "PG-Row",
            "Row Status": "System",
        },
        {
            "Page Name": "All Level-Sets",
            "Page Type": "Page List",
            "Page Edition": "Default",
            "Page Owner": "Admin",
            "Page URL": "URL to open this Page",
            "Page SEO": "'All Level-Sets'",
            "Page Status": "System",
            "Page Comment ":
                "Page:  Listing of all Level-Set Page's in the system.  Said Page is displayed in the AllLevelSet-dialog.",
            "Row Type": "PG-Row",
            "Row Status": "System",
        },
        {
            "Page Name": "All Search-Sets",
            "Page Type": "Page List",
            "Page Edition": "Default",
            "Page Owner": "Admin",
            "Page URL": "URL to open this Page",
            "Page SEO": "'All Search-Sets'",
            "Page Status": "System",
            "Page Comment ":
                "Page:  Listing of all Search-Set Page's in the system.  Said Page is displayed in the AllSearchSet-dialog.",
            "Row Type": "PG-Row",
            "Row Status": "System",
        },
        {
            "Page Name": "All Tokens",
            "Page Type": "",
            "Page Edition": "Default",
            "Page Owner": "Admin",
            "Page URL": "URL to open this Page",
            "Page SEO": "'Tokens'; 'Drop Down'",
            "Page Status": "System; DDS Page",
            "Page Comment ":
                "Page:  Predefined DropDown-Source's in the system.  Said Page is displayed in the AllDDS-dialog.",
            "Row Type": "PG-Row",
            "Row Status": "System",
        },
        {
            "Page Name": "All Labels",
            "Page Type": "",
            "Page Edition": "Default",
            "Page Owner": "Admin",
            "Page URL": "URL to open this Page",
            "Page SEO": "'All Labels'",
            "Page Status": "System; DDS Page",
            "Page Comment ":
                "Page:  All Label-Source's in the system.  Said Page is displayed as part of the AllLabel-dialog.",
            "Row Type": "PG-Row",
            "Row Status": "System",
        },
        {
            "Page Name": "All Units",
            "Page Type": "",
            "Page Edition": "Default",
            "Page Owner": "Admin",
            "Page URL": "URL to open this Page",
            "Page SEO": "'All Units'",
            "Page Status": "System; DDS Page",
            "Page Comment ":
                "Page:  All Measure-Unit's in the system.  Said Page is displayed in the AllUnit-dialog.",
            "Row Type": "PG-Row",
            "Row Status": "System",
        },
        {
            "Page Name": "All Regions",
            "Page Type": "",
            "Page Edition": "Default",
            "Page Owner": "Admin",
            "Page URL": "URL to open this Page",
            "Page SEO": "'All Regions'",
            "Page Status": "System; DDS Page",
            "Page Comment ":
                "Page:  All Country/Region's in the system.  Said Page is displayed in the AllRegion-dialog.",
            "Row Type": "PG-Row",
            "Row Status": "System",
        },
        {
            "Page Name": "All Suppliers",
            "Page Type": "",
            "Page Edition": "Default",
            "Page Owner": "Admin",
            "Page URL": "URL to open this Page",
            "Page SEO": "'All Suppliers'",
            "Page Status": "System; DDS Page",
            "Page Comment ":
                "Page:  All Manufacturer/Brand/Vendor's in the system.  Said Page is displayed in the AllSupplier-dialog.",
            "Row Type": "PG-Row",
            "Row Status": "System",
        },
        {
            "Page Name": "All Models",
            "Page Type": "",
            "Page Edition": "Default",
            "Page Owner": "Admin",
            "Page URL": "URL to open this Page",
            "Page SEO": "'All Models'",
            "Page Status": "System; DDS Page",
            "Page Comment ":
                "Page:  All Product Model's in the system.  Said Page is displayed in the AllModel-dialog.",
            "Row Type": "PG-Row",
            "Row Status": "System",
        },
    ];

    // fst entry in pg table for creating pg id

    for (let i = 0; i < data.length; i++) {
        const queryForPG = 'INSERT INTO public."t-PG" DEFAULT VALUES RETURNING "PG"';
        const queryForPGResult = await pool.query(queryForPG);
        data[i]["Page ID"] = queryForPGResult.rows[0].PG
        console.log("queryForPGResult.rows[0].PG", queryForPGResult.rows[0].PG);

    }

    console.log("data", data);


    const PGID = data[0]['Page ID'];

    console.log("PGID main", PGID);
    //create entry for col
    const Columns = Object.keys(data[0]);
    console.log("Columns", Columns, Columns.length);

    // loop for column insertion

    for (let i = 0; i < Columns.length; i++) {
        // Columns

        const queryForCol = 'INSERT INTO public."t-Col" DEFAULT VALUES RETURNING "Col"';
        const queryForColResult = await pool.query(queryForCol);
        let colId = queryForColResult.rows[0].Col
        // const keysCount = Object.keys(data[0]).length;
        console.log("colId", colId);

        // insert record for row

        const queryForColRow = `INSERT INTO public."t-Row" ("PG", "Row-Level") VALUES (${PGID}, 1) RETURNING "Row"`;
        const resultqueryForColRow = await pool.query(queryForColRow);

        let rowId = resultqueryForColRow.rows[0].Row;
        console.log("rowId", rowId);
        // insert item value

        const queryForItem = `INSERT INTO public."t-Item" ("Data-Type", "JSON") VALUES (${rowId},'"${Columns[i]}"') RETURNING "Item"`;
        const resultQueryForItem = await pool.query(queryForItem);

        const itemId = resultQueryForItem.rows[0].Item;
        console.log("itemId", itemId);
        const query = `INSERT INTO public."t-Cell" ("Row", "Col", "Items")VALUES (${rowId}, ${colId}, ARRAY[${itemId}]) `;
        console.log("query", query);
        const { rows } = await pool.query(query);

    }

    //loop for actual data insertion

    const columndetails = `SELECT Item."JSON" As "colName" , PG."PG" , Row."Row" , cell."Col"
    FROM public."t-PG" AS PG
    INNER JOIN public."t-Row" AS Row ON PG."PG" = Row."PG"
    INNER JOIN public."t-Cell" AS Cell ON Row."Row" = Cell."Row"
	INNER JOIN public."t-Item" AS Item ON Row."Row" = Item."Data-Type" where PG."PG"=${PGID}`;
    const result = await pool.query(columndetails);
    const colData = result.rows;
    let columnObj = {};

    for (let i = 0; i < colData.length; i++) {
        console.log(
            "colData[i].colName",
            colData[i].colName,
            "colData[i].Col",
            colData[i].Col
        );
        columnObj[colData[i].colName] = colData[i].Col;
    }

    console.log("columnObj", columnObj);

    // return false;
    for (let i = 0; i < data.length; i++) {
        // insert record for row

        const queryForColRow =
            `INSERT INTO public."t-Row" ("PG", "Row-Level") VALUES (${PGID}, 1) RETURNING "Row"`;
        console.log("queryForColRow", queryForColRow);
        const resultqueryForColRow = await pool.query(queryForColRow);

        let rowId = resultqueryForColRow.rows[0].Row;
        console.log("success Row");

        // console.log("rowId", rowId);
        // insert item value
        // console.log("data[i]",data[i]);
        for (let pageData in data[i]) {
            console.log("pageData", pageData);
            console.log("data[i]", data[i][pageData]);
            // const str = "'PG'; 'Page'; 'Pages'";
            const array = data[i][pageData].split(';').map(item => item.trim().replace(/'/g, ''));
            console.log(array); // Output: ['PG', 'Page', 'Pages']


            const queryForItem = `INSERT INTO public."t-Item" ("Data-Type", "JSON") VALUES (${rowId},'"${array}"') RETURNING "Item"`;
            console.log("queryForItem", queryForItem);
            const resultQueryForItem = await pool.query(queryForItem);
            const itemId = resultQueryForItem.rows[0].Item;
            console.log("itemId", itemId);
            console.log("success Item");

            let colIdFromObj = columnObj[pageData];

            console.log("colIdFromObj", colIdFromObj);

            // return false;

            const query = `INSERT INTO public."t-Cell" ("Row", "Col", "Items")VALUES (${rowId}, ${colIdFromObj}, ARRAY[${itemId}]) `;
            console.log("query", query);
            const { rows } = await pool.query(query);
            console.log("success cell");

        }
    }

    const query = `SELECT *
    FROM public."t-Cell" Cell
    INNER JOIN public."t-Item" Item ON Item."Item" = ANY(Cell."Items")
    ORDER BY Cell."Cell" DESC
    LIMIT 200`;

    console.log("final query", query);
    const { rows } = await pool.query(query);

    console.log("rows", rows);
    // Respond with the query result
    res.json(rows);
});


app.post("/insertColumn", async (req, res) => {


    let data = [
        {
            "Page Type": "Each Page",
            "Col Name": "Row",
            "Col Data-Type": "Row-ID",
            "Col DropDown-Source": "",
            "Col Formula": "= Each [t-Row.Row]",
            "Col Status": "Item# = 1; Unique; System; Hidden; Share",
            "Col Owner": "Admin",
            "Col Comment ": "Each Row matches a unique t-Row.Row",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "Each Page",
            "Col Name": "Row ID",
            "Col Data-Type": "Row-ID",
            "Col DropDown-Source": "",
            "Col Formula": "= Corrsp [t-Row.RowID]",
            "Col Status": "Item# = 1; System; Share",
            "Col Owner": "Admin",
            "Col Comment ": "Most users shall consider this Col as the 'Row ID' of each Row",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "Each Page",
            "Col Name": "Share",
            "Col Data-Type": "Row-ID",
            "Col DropDown-Source": "",
            "Col Formula": "= Corrsp [t-Row.Share];  Match [t-Share.Share]",
            "Col Status": "Item# ≤ 1; System; Hidden; Share",
            "Col Owner": "Admin",
            "Col Comment ": "Each Share matches a t-Row.Share",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "Each Page",
            "Col Name": "Inherit",
            "Col Data-Type": "Row-ID",
            "Col DropDown-Source": "",
            "Col Formula": "= Corrsp [t-Row.Inherit]",
            "Col Status": "Item# ≥ 0; System; Hidden; Share",
            "Col Owner": "Admin",
            "Col Comment ": "Each Inherit matches a t-Row.Inherit",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "Each Page",
            "Col Name": "Row Type",
            "Col Data-Type": "Drop-Down",
            "Col DropDown-Source": "Row Type",
            "Col Formula": "= Corrsp [t-Row.Row-Type]",
            "Col Status": "Item# ≥ 0; Hidden; Share",
            "Col Owner": "Admin",
            "Col Comment ": "Each 'Col DropDown-Source = xyz' means:  Col DropDown-Source-Cell = {(Row-ID of) Exclude DDS-Head : (Row-ID of) xyz}",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "Each Page",
            "Col Name": "Row Status",
            "Col Data-Type": "Drop-Down",
            "Col DropDown-Source": "Statuses",
            "Col Formula": "= [t-Format.Status] for [Row] = [t.Format.Object]",
            "Col Status": "Item# ≥ 0; System; Hidden; Share",
            "Col Owner": "Admin",
            "Col Comment ": "Each Status matches a t-Row.Status",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "Each Page",
            "Col Name": "Row Comment",
            "Col Data-Type": "ML-Text",
            "Col DropDown-Source": "",
            "Col Formula": "= Corrsp [t-Format.Comment]",
            "Col Status": "Item# ≤ 1; Hidden; Share",
            "Col Owner": "Admin",
            "Col Comment ": "Each Comment matches a t-Row.Comment",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "Category",
            "Col Name": "Label",
            "Col Data-Type": "Drop-Down",
            "Col DropDown-Source": "Category Label;  Product Label",
            "Col Formula": "",
            "Col Status": "Item# = 1; Nested; Share",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "Category",
            "Col Name": "Value",
            "Col Data-Type": "Value Data-Type",
            "Col DropDown-Source": "",
            "Col Formula": "",
            "Col Status": "Item# ≥ 0; Share",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "Category",
            "Col Name": "Key",
            "Col Data-Type": "Drop-Down",
            "Col DropDown-Source": "Key",
            "Col Formula": "",
            "Col Status": "Item# ≥ 0; Share",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "Product",
            "Col Name": "Label",
            "Col Data-Type": "Drop-Down",
            "Col DropDown-Source": "Product Label",
            "Col Formula": "",
            "Col Status": "Item# = 1; Nested; Share",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "Product",
            "Col Name": "Value",
            "Col Data-Type": "Value Data-Type",
            "Col DropDown-Source": "",
            "Col Formula": "",
            "Col Status": "Item# ≥ 0; Share",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "Product",
            "Col Name": "%DV",
            "Col Data-Type": "Percentage",
            "Col DropDown-Source": "",
            "Col Formula": "",
            "Col Status": "Item# ≤ 1; Share",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "Product",
            "Col Name": "Qty",
            "Col Data-Type": "Amount",
            "Col DropDown-Source": "",
            "Col Formula": "",
            "Col Status": "Item# ≤ 1; Share",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "Product",
            "Col Name": "Unit",
            "Col Data-Type": "Unit",
            "Col DropDown-Source": "",
            "Col Formula": "",
            "Col Status": "Item# ≤ 1; Share",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "Product",
            "Col Name": "Key",
            "Col Data-Type": "Drop-Down",
            "Col DropDown-Source": "Key",
            "Col Formula": "",
            "Col Status": "Item# ≥ 0; Share",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "Product",
            "Col Name": "Ingredient %",
            "Col Data-Type": "Percentage",
            "Col DropDown-Source": "",
            "Col Formula": "",
            "Col Status": "Item# ≤ 1; Share",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "Product",
            "Col Name": "per Product",
            "Col Data-Type": "Amount",
            "Col DropDown-Source": "",
            "Col Formula": "",
            "Col Status": "Item# ≤ 1; Share",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "Product",
            "Col Name": "per Mid Pkg",
            "Col Data-Type": "Amount",
            "Col DropDown-Source": "",
            "Col Formula": "",
            "Col Status": "Item# ≤ 1; Share",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "Product",
            "Col Name": "per Day",
            "Col Data-Type": "Amount",
            "Col DropDown-Source": "",
            "Col Formula": "",
            "Col Status": "Item# ≤ 1; Share",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "Product",
            "Col Name": "per Serving",
            "Col Data-Type": "Amount",
            "Col DropDown-Source": "",
            "Col Formula": "",
            "Col Status": "Item# ≤ 1; Share",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "Product",
            "Col Name": "per Small Pkg",
            "Col Data-Type": "Amount",
            "Col DropDown-Source": "",
            "Col Formula": "",
            "Col Status": "Item# ≤ 1; Share",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "Product",
            "Col Name": "Price per",
            "Col Data-Type": "Amount",
            "Col DropDown-Source": "",
            "Col Formula": "",
            "Col Status": "Item# ≤ 1; Share",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "Product",
            "Col Name": "Preference",
            "Col Data-Type": "Drop-Down",
            "Col DropDown-Source": "Preference",
            "Col Formula": "",
            "Col Status": "Item# ≤ 1; Share",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "Product",
            "Col Name": "Info Source",
            "Col Data-Type": "URL",
            "Col DropDown-Source": "",
            "Col Formula": "",
            "Col Status": "Item# ≥ 0; Share",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "Level-Set",
            "Col Name": "Label",
            "Col Data-Type": "Drop-Down",
            "Col DropDown-Source": "Level-Set Label",
            "Col Formula": "",
            "Col Status": "Item# = 1; Nested; Share",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "Level-Set",
            "Col Name": "Value",
            "Col Data-Type": "Value Data-Type",
            "Col DropDown-Source": "",
            "Col Formula": "",
            "Col Status": "Item# ≤ 1; Share",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "Level-Set",
            "Col Name": "Level Active",
            "Col Data-Type": "Drop-Down",
            "Col DropDown-Source": "True / False",
            "Col Formula": "",
            "Col Status": "Item# ≤ 1; Share",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "Level-Set",
            "Col Name": "Level Font-Style",
            "Col Data-Type": "Font-Style",
            "Col DropDown-Source": "",
            "Col Formula": "",
            "Col Status": "Item# ≤ 1; Share",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "Level-Set",
            "Col Name": "Level Sort-By",
            "Col Data-Type": "Formula",
            "Col DropDown-Source": "",
            "Col Formula": "",
            "Col Status": "Item# ≤ 1; Share",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "Level-Set",
            "Col Name": "Level Group-By",
            "Col Data-Type": "Formula",
            "Col DropDown-Source": "",
            "Col Formula": "",
            "Col Status": "Item# ≤ 1; Share",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "Level-Set",
            "Col Name": "Level Filter",
            "Col Data-Type": "Formula",
            "Col DropDown-Source": "",
            "Col Formula": "",
            "Col Status": "Item# ≤ 1; Share",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "Search-Set",
            "Col Name": "Label",
            "Col Data-Type": "Drop-Down",
            "Col DropDown-Source": "Search-Set Label",
            "Col Formula": "",
            "Col Status": "Item# = 1; Nested; Share",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "Search-Set",
            "Col Name": "Value",
            "Col Data-Type": "Value Data-Type",
            "Col DropDown-Source": "",
            "Col Formula": "",
            "Col Status": "Item# ≤ 1; Share",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "Search-Set",
            "Col Name": "Param Label",
            "Col Data-Type": "Drop-Down",
            "Col DropDown-Source": "Search-Set Label",
            "Col Formula": "",
            "Col Status": "Item# ≤ 1; Share",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "Search-Set",
            "Col Name": "Param Opr",
            "Col Data-Type": "Drop-Down",
            "Col DropDown-Source": "Param Opr",
            "Col Formula": "",
            "Col Status": "Item# ≤ 1; Share",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "Search-Set",
            "Col Name": "Param Value",
            "Col Data-Type": "ML-Text",
            "Col DropDown-Source": "",
            "Col Formula": "",
            "Col Status": "Item# ≥ 0; Share",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "Page ID",
            "Col Data-Type": "Page-ID",
            "Col DropDown-Source": "",
            "Col Formula": "= Each [t-PG.PG]",
            "Col Status": "Item# = 1; Unique; System",
            "Col Owner": "Admin",
            "Col Comment ": "Each Page ID matches a unique t-PG.PG",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "Page Name",
            "Col Data-Type": "ML-Text",
            "Col DropDown-Source": "",
            "Col Formula": "",
            "Col Status": "Item# = 1; Unique; Nested",
            "Col Owner": "Admin",
            "Col Comment ": "Each Page Name is unique across 'All Pages'",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "Page Type",
            "Col Data-Type": "Drop-Down",
            "Col DropDown-Source": "Page Type",
            "Col Formula": "",
            "Col Status": "Item# ≤ 1; System",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "Page Edition",
            "Col Data-Type": "Drop-Down",
            "Col DropDown-Source": "Edition",
            "Col Formula": "",
            "Col Status": "Item# = 1",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "Page URL",
            "Col Data-Type": "URL",
            "Col DropDown-Source": "",
            "Col Formula": "= [our_domain] [Page ID]  [Page Name]",
            "Col Status": "Item# ≤ 1; Unique",
            "Col Owner": "Admin",
            "Col Comment ": "Each Page URL is unique across the system",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "Page SEO",
            "Col Data-Type": "ML-Text",
            "Col DropDown-Source": "",
            "Col Formula": "",
            "Col Status": "Item# ≥ 0",
            "Col Owner": "Admin",
            "Col Comment ": "Each Page has 0-or-more SEO keyword(s)",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "Page Owner",
            "Col Data-Type": "User-ID",
            "Col DropDown-Source": "",
            "Col Formula": "= [t-Format.Owner] for [Page ID] = [t.Format.Object]",
            "Col Status": "Item# = 1; System",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "Page Status",
            "Col Data-Type": "Drop-Down",
            "Col DropDown-Source": "Statuses",
            "Col Formula": "= Corrsp [t-Format.Status]",
            "Col Status": "Item# ≥ 0; System",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "Page Comment ",
            "Col Data-Type": "ML-Text",
            "Col DropDown-Source": "",
            "Col Formula": "= Corrsp [t-Format.Comment]",
            "Col Status": "Item# ≤ 1",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "Col ID",
            "Col Data-Type": "Col-ID",
            "Col DropDown-Source": "",
            "Col Formula": "= Each [t-Col.Col]",
            "Col Status": "Item# = 1; Unique; System",
            "Col Owner": "Admin",
            "Col Comment ": "Each Col ID matches a unique t-Col.Col",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "Page Type",
            "Col Data-Type": "Drop-Down",
            "Col DropDown-Source": "Page Type",
            "Col Formula": "",
            "Col Status": "Item# ≤ 1; System",
            "Col Owner": "Admin",
            "Col Comment ": "Either Page Type-Cell≠NULL or Page ID-Cell≠NULL, but not both in the same Row.",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "Page ID",
            "Col Data-Type": "Page-ID",
            "Col DropDown-Source": "",
            "Col Formula": "",
            "Col Status": "Item# ≤ 1; System",
            "Col Owner": "Admin",
            "Col Comment ": "If Page ID-Cell≠NULL then said Page (i.e. Page ID) contains sald Col.",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "Col Name",
            "Col Data-Type": "ML-Text",
            "Col DropDown-Source": "",
            "Col Formula": "",
            "Col Status": "Item# = 1; Nested",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "Col Data-Type",
            "Col Data-Type": "Drop-Down",
            "Col DropDown-Source": "Data Type",
            "Col Formula": "",
            "Col Status": "Item# = 1",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "Col DropDown-Source",
            "Col Data-Type": "DropDown-Source",
            "Col DropDown-Source": "",
            "Col Formula": "",
            "Col Status": "Item# ≤ 1",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "Col Default-Data",
            "Col Data-Type": "ML-Text",
            "Col DropDown-Source": "",
            "Col Formula": "= [t-Format.Default] for [Col ID] = [t.Format.Object]",
            "Col Status": "Item# ≥ 0",
            "Col Owner": "Admin",
            "Col Comment ": "The 'Default Data (stored as ML-Text)' of all the corrsp Cells of said Col.",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "Col Formula",
            "Col Data-Type": "Formula",
            "Col DropDown-Source": "",
            "Col Formula": "= Corrsp [t-Format.Formula]",
            "Col Status": "Item# ≤ 1",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "Col Status",
            "Col Data-Type": "Drop-Down",
            "Col DropDown-Source": "Statuses",
            "Col Formula": "= Corrsp [t-Format.Status]",
            "Col Status": "Item# ≥ 0",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "Col Owner",
            "Col Data-Type": "User-ID",
            "Col DropDown-Source": "",
            "Col Formula": "= Corrsp [t-Format.Owner]",
            "Col Status": "Item# = 1",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "Col Comment ",
            "Col Data-Type": "ML-Text",
            "Col DropDown-Source": "",
            "Col Formula": "= Corrsp [t-Format.Comment]",
            "Col Status": "Item# ≤ 1",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "Label",
            "Col Data-Type": "Drop-Down",
            "Col DropDown-Source": "Profile Label; Display Setting",
            "Col Formula": "",
            "Col Status": "Item# = 1; Nested",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "Value",
            "Col Data-Type": "Value Data-Type",
            "Col DropDown-Source": "",
            "Col Formula": "",
            "Col Status": "Item# ≥ 0",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "User ID",
            "Col Data-Type": "User-ID",
            "Col DropDown-Source": "",
            "Col Formula": "= Each [t-User.User]",
            "Col Status": "Item# = 1",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "User Type",
            "Col Data-Type": "Drop-Down",
            "Col DropDown-Source": "User Type",
            "Col Formula": "= Corrsp [t-User].[User-Type]",
            "Col Status": "Item# = 1",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "Username",
            "Col Data-Type": "Text",
            "Col DropDown-Source": "",
            "Col Formula": "= [All Profiles].[Username].[Value] for [All Profiles].[Row] = [User ID]",
            "Col Status": "Item# = 1",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "Category ID",
            "Col Data-Type": "Category-ID",
            "Col DropDown-Source": "",
            "Col Formula": "= Each [All Pages].[Page ID] for [All Pages].[Page Type] = [All Tokens].[Category]",
            "Col Status": "Item# = 1; System",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "Category Name",
            "Col Data-Type": "ML-Text",
            "Col DropDown-Source": "",
            "Col Formula": "= Corrsp [All Pages].[Page Name]",
            "Col Status": "Item# = 1; Nested",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "# of Child Category(s)",
            "Col Data-Type": "SmallInt",
            "Col DropDown-Source": "",
            "Col Formula": "= ChildCats( [Category ID] )",
            "Col Status": "Item# = 1; System",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "# of Descendant Category(s)",
            "Col Data-Type": "SmallInt",
            "Col DropDown-Source": "",
            "Col Formula": "= DescCats( [Category ID] )",
            "Col Status": "Item# = 1; System",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "# of Child Product(s)",
            "Col Data-Type": "SmallInt",
            "Col DropDown-Source": "",
            "Col Formula": "= ChildProds( [Category ID] )",
            "Col Status": "Item# = 1; System",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "# of Descendant Product(s)",
            "Col Data-Type": "SmallInt",
            "Col DropDown-Source": "",
            "Col Formula": "= DescProds( [Category ID] )",
            "Col Status": "Item# = 1; System",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "Product ID",
            "Col Data-Type": "Product-ID",
            "Col DropDown-Source": "",
            "Col Formula": "= Each [All Pages].[Page ID] for [All Pages].[Page Type] = [All Tokens].[Product]",
            "Col Status": "Item# = 1; System",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "Product Name",
            "Col Data-Type": "ML-Text",
            "Col DropDown-Source": "",
            "Col Formula": "= Corrsp [All Pages].[Page Name]",
            "Col Status": "Item# = 1; Nested",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "# of Parent Category(s)",
            "Col Data-Type": "SmallInt",
            "Col DropDown-Source": "",
            "Col Formula": "= ParentCats( [Product ID] )",
            "Col Status": "Item# = 1; System",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "Level-Set ID",
            "Col Data-Type": "Level-Set-ID",
            "Col DropDown-Source": "",
            "Col Formula": "= Each [All Pages].[Page ID] for [All Pages].[Page Type] = [All Tokens].[Level-Set]",
            "Col Status": "Item# = 1; System",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "Level-Set Name",
            "Col Data-Type": "ML-Text",
            "Col DropDown-Source": "",
            "Col Formula": "= Corrsp [All Pages].[Page Name]",
            "Col Status": "Item# = 1; Nested",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "# of Applying Page(s)",
            "Col Data-Type": "SmallInt",
            "Col DropDown-Source": "",
            "Col Formula": "= AppliedPGs( [Level-Set ID] )",
            "Col Status": "Item# = 1; System",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "Search-Set ID",
            "Col Data-Type": "Search-Set-ID",
            "Col DropDown-Source": "",
            "Col Formula": "= Each [All Pages].[Page ID] for [All Pages].[Page Type] = [All Tokens].[Search-Set]",
            "Col Status": "Item# = 1; System",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "Search-Set Name",
            "Col Data-Type": "ML-Text",
            "Col DropDown-Source": "",
            "Col Formula": "= Corrsp [All Pages].[Page Name]",
            "Col Status": "Item# = 1; Nested",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "# of Applying Page(s)",
            "Col Data-Type": "SmallInt",
            "Col DropDown-Source": "",
            "Col Formula": "= AppliedPGs( [Search-Set ID] )",
            "Col Status": "Item# = 1; System",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "Token",
            "Col Data-Type": "ML-Text",
            "Col DropDown-Source": "",
            "Col Formula": "",
            "Col Status": "Item# = 1; Nested",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "Label",
            "Col Data-Type": "ML-Text",
            "Col DropDown-Source": "",
            "Col Formula": "",
            "Col Status": "Item# = 1; Nested",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "Value Data-Type",
            "Col Data-Type": "Drop-Down",
            "Col DropDown-Source": "Data Type",
            "Col Formula": "",
            "Col Status": "Item# ≤ 1",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "Value DropDown-Source",
            "Col Data-Type": "DropDown-Source",
            "Col DropDown-Source": "",
            "Col Formula": "",
            "Col Status": "Item# ≤ 1",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "Value Default-Data",
            "Col Data-Type": "Value Data-Type",
            "Col DropDown-Source": "",
            "Col Formula": "",
            "Col Status": "Item# ≥ 0",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "Value Status",
            "Col Data-Type": "Drop-Down",
            "Col DropDown-Source": "Statuses",
            "Col Formula": "",
            "Col Status": "Item# ≥ 0",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "Value Formula",
            "Col Data-Type": "Formula",
            "Col DropDown-Source": "",
            "Col Formula": "",
            "Col Status": "Item# ≤ 1",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "Unit",
            "Col Data-Type": "ML-Text",
            "Col DropDown-Source": "",
            "Col Formula": "",
            "Col Status": "Item# = 1; Nested; System",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "Unit Factor",
            "Col Data-Type": "Number",
            "Col DropDown-Source": "",
            "Col Formula": "",
            "Col Status": "Item# ≤ 1; System",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "Region",
            "Col Data-Type": "ML-Text",
            "Col DropDown-Source": "",
            "Col Formula": "",
            "Col Status": "Item# = 1; Nested",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "Supplier",
            "Col Data-Type": "ML-Text",
            "Col DropDown-Source": "",
            "Col Formula": "",
            "Col Status": "Item# = 1; Nested",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "Model",
            "Col Data-Type": "ML-Text",
            "Col DropDown-Source": "",
            "Col Formula": "",
            "Col Status": "Item# = 1; Nested",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        },
        {
            "Page Type": "",
            "Col Name": "Release Date",
            "Col Data-Type": "Date",
            "Col DropDown-Source": "",
            "Col Formula": "",
            "Col Status": "Item# ≤ 1",
            "Col Owner": "Admin",
            "Col Comment ": "",
            "Row Type": "Col-Row",
            "Row Status": "System",
            "": ""
        }
    ];

    // "Page Type": "Each Page",
    // "Col Name": "Row",
    // "Col Data-Type": "Row-ID",
    // "Col DropDown-Source": "",
    // "Col Formula": "= Each [t-Row.Row]",
    // "Col Status": "Item# = 1; Unique; System; Hidden; Share",
    // "Col Owner": "Admin",
    // "Col Comment ": "Each Row matches a unique t-Row.Row",
    // "Row Type": "Col-Row",
    // "Row Status": "System",

    const PGID = 1000000002;

    console.log("PGID main", PGID);
    //create entry for col
    const Columns = Object.keys(data[0]);
    console.log("Columns", Columns, Columns.length);

    // loop for column insertion

    for (let i = 0; i < Columns.length; i++) {
        // Columns

        const queryForCol = 'INSERT INTO public."t-Col" DEFAULT VALUES RETURNING "Col"';
        const queryForColResult = await pool.query(queryForCol);
        let colId = queryForColResult.rows[0].Col
        // const keysCount = Object.keys(data[0]).length;
        console.log("colId", colId);

        // insert record for row

        const queryForColRow = `INSERT INTO public."t-Row" ("PG", "Row-Level") VALUES (${PGID}, 1) RETURNING "Row"`;
        const resultqueryForColRow = await pool.query(queryForColRow);

        let rowId = resultqueryForColRow.rows[0].Row;
        console.log("rowId", rowId);
        // insert item value

        const queryForItem = `INSERT INTO public."t-Item" ("Data-Type", "JSON") VALUES (${rowId},'"${Columns[i]}"') RETURNING "Item"`;
        const resultQueryForItem = await pool.query(queryForItem);

        const itemId = resultQueryForItem.rows[0].Item;
        console.log("itemId", itemId);
        const query = `INSERT INTO public."t-Cell" ("Row", "Col", "Items")VALUES (${rowId}, ${colId}, ARRAY[${itemId}]) `;
        console.log("query", query);
        const { rows } = await pool.query(query);

    }

    //loop for actual data insertion

    const columndetails = `SELECT Item."JSON" As "colName" , PG."PG" , Row."Row" , cell."Col"
    FROM public."t-PG" AS PG
    INNER JOIN public."t-Row" AS Row ON PG."PG" = Row."PG"
    INNER JOIN public."t-Cell" AS Cell ON Row."Row" = Cell."Row"
	INNER JOIN public."t-Item" AS Item ON Row."Row" = Item."Data-Type" where PG."PG"=${PGID}`;
    const result = await pool.query(columndetails);
    const colData = result.rows;
    let columnObj = {};

    for (let i = 0; i < colData.length; i++) {
        console.log(
            "colData[i].colName",
            colData[i].colName,
            "colData[i].Col",
            colData[i].Col
        );
        columnObj[colData[i].colName] = colData[i].Col;
    }

    console.log("columnObj", columnObj);

    // return false;
    for (let i = 0; i < data.length; i++) {
        // insert record for row

        const queryForColRow =
            `INSERT INTO public."t-Row" ("PG", "Row-Level") VALUES (${PGID}, 1) RETURNING "Row"`;
        console.log("queryForColRow", queryForColRow);
        const resultqueryForColRow = await pool.query(queryForColRow);

        let rowId = resultqueryForColRow.rows[0].Row;
        console.log("success Row");

        // console.log("rowId", rowId);
        // insert item value
        // console.log("data[i]",data[i]);
        for (let pageData in data[i]) {
            console.log("pageData", pageData);
            console.log("data[i]", data[i][pageData]);
            // const str = "'PG'; 'Page'; 'Pages'";
            const array = data[i][pageData].split(';').map(item => item.trim().replace(/'/g, ''));
            console.log(array); // Output: ['PG', 'Page', 'Pages']


            const queryForItem = `INSERT INTO public."t-Item" ("Data-Type", "JSON") VALUES (${rowId},'"${array}"') RETURNING "Item"`;
            console.log("queryForItem", queryForItem);
            const resultQueryForItem = await pool.query(queryForItem);
            const itemId = resultQueryForItem.rows[0].Item;
            console.log("itemId", itemId);
            console.log("success Item");

            let colIdFromObj = columnObj[pageData];

            console.log("colIdFromObj", colIdFromObj);

            // return false;

            const query = `INSERT INTO public."t-Cell" ("Row", "Col", "Items")VALUES (${rowId}, ${colIdFromObj}, ARRAY[${itemId}]) `;
            console.log("query", query);
            const { rows } = await pool.query(query);
            console.log("success cell");

        }
    }

    const query = `SELECT *
    FROM public."t-Cell" Cell
    INNER JOIN public."t-Item" Item ON Item."Item" = ANY(Cell."Items")
    ORDER BY Cell."Cell" DESC
    LIMIT 200`;

    console.log("final query", query);
    const { rows } = await pool.query(query);

    console.log("rows", rows);
    // Respond with the query result
    res.json(rows);
});

app.listen(5656);
console.log("app is running on 5656");
