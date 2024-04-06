"use strict";

function initializeUI() {

    let testProgram1=	
    "addi t0, zero, -0x23"+ "\n"+
	"   andi t0, t0, -0xf"+"\n"+
    "             \n"+
	"addi t0, t0, 0xA0"+"\n"+
	    // ilegal operands: "addi t9, t0, 0xA0"+"\n"+
    "addi t2, zero, -0x13"+"\n"+
    "sw t2, 0(zero)  "+"\n"+
    "lw t1, 0(zero)  ";

    let testProgram2=
    "addi t0, zero, 0\n"+
    "addi t1, zero, 5\n"+
    "incloop:\n"+
    "addi t0, t0, 1\n"+
    "blt t0, t1, incloop\n"+
    "programExit:";

    let testProgram3=
    "   addi t0, zero, 0 \n"+
    "   jal ra, a10 \n"+
    "   jal zero, programexit \n"+
    "   addi t0, zero, zero \n"+
    "   a10: \n"+
    "   addi t0, t0, 10 \n"+
    "   jalr a0, 0(ra) \n"+
    " programexit:   ";

    let testProgram=testProgram3;
    //transform the program into an array of lines
    let testProgramL=testProgram.split("\n");


    // initialize editor https://ace.c9.io/#nav=howto
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/javascript");
    editor.setReadOnly(true);
    editor.setHighlightActiveLine(true);

    //load test program into editor
    editor.setValue(testProgram);

    // reset textarea content
    document.getElementById('MyTextArea').value = '';
    /*for (let i=0; i<15; i++) {
        document.getElementById('MyTextArea').value += "linea "+i+"\n";
    }*/


    // set up the virtual machine
    let M=new Uint8Array(64*1024);
    let R= new Int32Array(32);
    let RN= ["zero", "ra", "sp", "gp", "tp", "t0", "t1","t2", "s0", "s1", "a0", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "s11", "t3", "t4", "t5", "t6"];
    let myMachine = {
        registers: R,
        registersNames: RN,
        programCode: testProgramL,
        currentProgramLine: 0,
        memory: M,

        // using methods to read/write registers we make sure x0 always =0
        readRegister: function(regnum) {
            this.registers[0]=0;
            return this.registers[regnum];
        },
        writeRegister: function(regnum, value) {
            this.registers[regnum]=value;
            this.registers[0]=0;
        },

        writeWordToMemory: function(memaddr, value) {
            this.memory[memaddr]=(value&0xff);
            this.memory[memaddr+1]=((value&0xff00)>>8);
            this.memory[memaddr+2]=((value&0xff0000)>>16);
            this.memory[memaddr+3]=((value&0xff000000)>>24);
        },
        readWordFromMemory: function(memaddr) {
            let w=0;
            w=w|this.memory[memaddr];
            w=w|(this.memory[memaddr+1]<<8);
            w=w|(this.memory[memaddr+2]<<16);
            w=w|(this.memory[memaddr+3]<<24);
            return w;
        }

    };
    for (let i=0; i<32; i++) {
        myMachine.writeRegister(i, 0);
    }
    //


    // simulate execution
    try {
        while (myMachine.currentProgramLine<myMachine.programCode.length) {

            //clean the asm line of tabs, spaces and comments
            let cleanLine=cleanASMLine(myMachine.programCode[myMachine.currentProgramLine]);
            let firstToken=getFirstToken(myMachine.programCode[myMachine.currentProgramLine]);

            // try to execute line
            document.getElementById('MyTextArea').value+="First Token: "+firstToken+"\n";
            executeLine(cleanLine, myMachine, firstToken);

            // advance program line
            myMachine.currentProgramLine++;
        }
    } catch (err) {
        document.getElementById('MyTextArea').value+="ERROR: "+err.message+ " in line "+(myMachine.currentProgramLine+1)+"\n";
    }
/*    
    //test
    let lln=findLabelInSource(myMachine, "programexit");
    document.getElementById('MyTextArea').value+="findLabelInSource label at "+lln+"\n";
*/
    //let myRegistersDiv = document.getElementById('RegistersDiv');
    //myRegistersDiv.innerHTML="<p>hola</p>";
    updateRegistersInHTML(myMachine);
}

// returns the line number a label is at, or -1 if not found
function findLabelInSource(machinep, labelp) {
    for (let i=0; i<machinep.programCode.length; i++) {
        let cleanLine=cleanASMLine(machinep.programCode[i]);
        if (cleanLine.indexOf(labelp+":")!=-1) {
            return i;
        }
    }
    return -1;
}

//clean the asm line of tabs, spaces and comments
function cleanASMLine(lineToClean) {
    //clean line of tabs and spaces
    let lineWithoutSpacesAndTabs="";
    for (let i=0; i<lineToClean.length; i++) {
        if (lineToClean[i]=="#") break; // we don't want comments in the clean line
        if ((lineToClean[i]!=" ")&&(lineToClean[i]!="\t")) {
            lineWithoutSpacesAndTabs+=lineToClean[i];
        }
    }
    return lineWithoutSpacesAndTabs;
}

function getFirstToken(linep) {
    //clean line of tabs and spaces
    let lineWithoutComments="";
    for (let i=0; i<linep.length; i++) {
        if (linep[i]=="#") break; // we don't want comments in the clean line
        lineWithoutComments+=linep[i];
    }
    
    // return the first non empty token
    let tokens=lineWithoutComments.split(" ");
    for (let i=0; i<tokens.length; i++) {
        if (tokens[i].length>0)
        return tokens[i];
    }
    return ""; // else, return a null token
}

function updateRegistersInHTML(machine) {
    let myRegistersDiv = document.getElementById('RegistersDiv');
    let s="<table><tr> <th>Register</th> <th>Value</th> </tr>";
    for (let i=0; i<32; i++) {
        s+= "<tr> <td>x"  +i+" "+machine.registersNames[i]+   "</td> <td>"+machine.registers[i]+"</td> </tr>";
    }
    s+="</table>";
    myRegistersDiv.innerHTML=s;
    //myRegistersDiv.innerHTML="<table><tr><th>Register</th><th>Value</th></tr><tr><td>x0 zero</td><td>value</td></tr><tr><td>x1 ra</td><td>0 orsth</td></tr>";
}

// execute an ASM line
function executeLine(lineWithoutSpacesAndTabs, machinep, firstTokenp) {

    //ADDI
    if ((lineWithoutSpacesAndTabs[0]=='a')&&((lineWithoutSpacesAndTabs[1]=='d'))&&(lineWithoutSpacesAndTabs[2]=='d')&&
        (lineWithoutSpacesAndTabs[3]=='i')) {
            // decode line
            let decInstr=decodeRRILine(lineWithoutSpacesAndTabs, machinep);

            //execute line
            machinep.writeRegister(decInstr.operand1, machinep.readRegister(decInstr.operand2)+decInstr.immediate);

            document.getElementById('MyTextArea').value+="[ADDI x"+decInstr.operand1+" x"+decInstr.operand2+" "+decInstr.immediate+"]\n";
    }

    //ANDI
    if ((lineWithoutSpacesAndTabs[0]=='a')&&((lineWithoutSpacesAndTabs[1]=='n'))&&(lineWithoutSpacesAndTabs[2]=='d')&&
        (lineWithoutSpacesAndTabs[3]=='i')) {
            //decode line
            let decInstr=decodeRRILine(lineWithoutSpacesAndTabs, machinep);

            //execute line
            machinep.writeRegister(decInstr.operand1, (machinep.readRegister(decInstr.operand2)&decInstr.immediate));


            document.getElementById('MyTextArea').value+="[ANDI x"+decInstr.operand1+" x"+decInstr.operand2+" "+decInstr.immediate+"]\n";
    }

    //SW
    if ((lineWithoutSpacesAndTabs[0]=='s')&&((lineWithoutSpacesAndTabs[1]=='w'))) {
        // decode line
        let decInstr=decodeRMEMLine(lineWithoutSpacesAndTabs, machinep);

        //execute line
        machinep.writeWordToMemory( machinep.readRegister(decInstr.operand2)+decInstr.immediate, machinep.readRegister(decInstr.operand1) );

        document.getElementById('MyTextArea').value+="[SW x"+decInstr.operand1+" IMM " +decInstr.immediate+ "( "+ decInstr.operand2+" )]\n";            
    }

    //LW
    if ((lineWithoutSpacesAndTabs[0]=='l')&&((lineWithoutSpacesAndTabs[1]=='w'))) {
        // decode line
        let decInstr=decodeRMEMLine(lineWithoutSpacesAndTabs, machinep);

        //execute line
        machinep.writeRegister(decInstr.operand1, machinep.readWordFromMemory(machinep.readRegister(decInstr.operand2)+decInstr.immediate) );

        document.getElementById('MyTextArea').value+="[SW x"+decInstr.operand1+" IMM " +decInstr.immediate+ "( "+ decInstr.operand2+" )]\n";            
    }

    //BLT
    if ((lineWithoutSpacesAndTabs[0]=='b')&&(lineWithoutSpacesAndTabs[1]=='l')&&(lineWithoutSpacesAndTabs[2]=='t')) {
        // decode line
        let decInstr=decodeRRLabel(lineWithoutSpacesAndTabs, machinep);

        // label must be found in source code
        let lln=findLabelInSource(machinep, decInstr.label);
        if (lln==-1) {
            throw new Error ("label not found in source");
        }

        //execute line
        if (machinep.readRegister(decInstr.operand1)<machinep.readRegister(decInstr.operand2)) {
            machinep.currentProgramLine=lln;
        }

        document.getElementById('MyTextArea').value+="[BLT x"+decInstr.operand1+" x " +decInstr.operand2+ " "+decInstr.label+" ]\n";            
    }

    //JAL & JALR
    if ((lineWithoutSpacesAndTabs[0]=='j')&&(lineWithoutSpacesAndTabs[1]=='a')&&(lineWithoutSpacesAndTabs[2]=='l')) {
        
        // try to decode line as "Reg, imm(Reg)". If we succeed it's a jalr instruction
        let decodeAsRMEMLineSucceded=true;
        try {
            let decInstr=decodeRMEMLine(lineWithoutSpacesAndTabs, machinep);

            // it's a jalr instruction, execute it
            machinep.writeRegister(decInstr.operand1, machinep.currentProgramLine);
            machinep.currentProgramLine=machinep.readRegister(decInstr.operand2)+decInstr.immediate;

            document.getElementById('MyTextArea').value+="[JALR x"+decInstr.operand1+" IMM " +decInstr.immediate+ "( "+ decInstr.operand2+" )]\n";            
        }
        catch (err) {
            decodeAsRMEMLineSucceded=false;
            //document.getElementById('MyTextArea').value+="decodeAsRMEMLineSucceded\n";            
        }

        //ok, it's jal and not jalr
        if (decodeAsRMEMLineSucceded==false) {
            let decInstr=decodeRLabelLine(lineWithoutSpacesAndTabs, machinep);

            // label must be found in source code
            let lln=findLabelInSource(machinep, decInstr.label);
            if (lln==-1) {
            throw new Error ("label not found in source");
            }

            // execute the jal instruction
            machinep.writeRegister(decInstr.operand1, machinep.currentProgramLine);
            machinep.currentProgramLine=lln;

            document.getElementById('MyTextArea').value+="[JAL x"+decInstr.operand1+" label "+decInstr.label+" ]\n";            
        }
    }


}  

// decode an Reg-Reg-Imm instruction into operands
function decodeRRILine(textLine, myMachinep) {
    let splitInstr=textLine.split(",");
    if (splitInstr.length!=3) {
        throw new Error ("Ilegal instruction operands");
    }
    
    // check for operators
    let op1=-1;
    for (let i=0; i<32; i++) {
        if (splitInstr[0].includes(myMachinep.registersNames[i])) {
            op1=i;
        }
    }
    let op2=-1;
    for (let i=0; i<32; i++) {
        if (splitInstr[1].includes(myMachinep.registersNames[i])) {
            op2=i;
        }
    }
    if ((op1==-1)||(op2==-1)) {
        throw new Error ("ilegal instruction operands");
    }
    let imm=parseInt(splitInstr[2]);
    if (isNaN(imm)) {
        throw new Error ("ilegal immediate value");
    }

    let decodedInstr = {
        operand1: op1,
        operand2: op2,
        immediate: imm
    }
    
    return decodedInstr;
}

// decode an Register-Memory instruction into operands
function decodeRMEMLine(textLine, myMachinep) {
    let splitInstr=textLine.split(",");
    if (splitInstr.length!=2) {
        throw new Error ("Ilegal instruction operands");
    }
    
    // check for operators
    let op1=-1;
    for (let i=0; i<32; i++) {
        if (splitInstr[0].includes(myMachinep.registersNames[i])) {
            op1=i;
        }
    }
    let imm=parseInt(splitInstr[1]);
    if (isNaN(imm)) {
        throw new Error ("ilegal immediate value");
        
    }
    let op2=-1;
    for (let i=0; i<32; i++) {
        if (splitInstr[1].includes(myMachinep.registersNames[i])) {
            op2=i;
        }
    }
    if ((op1==-1)||(op2==-1)) {
        throw new Error ("ilegal instruction operands");
    }

    let decodedInstr = {
        operand1: op1,
        operand2: op2,
        immediate: imm
    }
    
    return decodedInstr;

}

function decodeRRLabel(textLine, myMachinep) {
    let splitInstr=textLine.split(",");
    if (splitInstr.length!=3) {
        throw new Error ("Ilegal instruction operands");
    }
    
    // check for operators
    let op1=-1;
    for (let i=0; i<32; i++) {
        if (splitInstr[0].includes(myMachinep.registersNames[i])) {
            op1=i;
        }
    }
    let op2=-1;
    for (let i=0; i<32; i++) {
        if (splitInstr[1].includes(myMachinep.registersNames[i])) {
            op2=i;
        }
    }
    if ((op1==-1)||(op2==-1)) {
        throw new Error ("ilegal instruction operands");
    }
    let labl=splitInstr[2];

    let decodedInstr = {
        operand1: op1,
        operand2: op2,
        label: labl
    }
    
    return decodedInstr;
}

function decodeRLabelLine(textLine, myMachinep) {
    let splitInstr=textLine.split(",");
    if (splitInstr.length!=2) {
        throw new Error ("Ilegal instruction operands");
    }

    // check for operators
    let op1=-1;
    for (let i=0; i<32; i++) {
        if (splitInstr[0].includes(myMachinep.registersNames[i])) {
            op1=i;
        }
    }

    if (op1==-1) {
        throw new Error ("ilegal instruction operands");
    }

    let labl=splitInstr[1];

    let decodedInstr = {
        operand1: op1,
        label: labl
    }
    
    return decodedInstr;    
}