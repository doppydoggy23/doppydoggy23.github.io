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
    "    jal zero, programexit \n"+
    "    addi t0, zero, zero \n"+
    "     a10:   \n"+
    "   addi t0, t0, 10 \n"+
    "   jalr a0, 0(ra) \n"+
    " programexit:    ";

    let testProgram4=
    `.data\n
    \n
    dataword1: \n
        .word 0x12345678\n
    string1:\n
        .asciiz "Hello World!\\n" \n
    dataword2:\n
        .word 0xABCDEF01\n
    string2:\n
        .asciiz "This is string 2\\n"\n
    \n
        #here it goes the code\n
        .text\n
        \n
    main:\n
    \n
    la a0, dataword2    
        la a1, programexit    
        la a3, dataword1
    li t0, 0x12345678 
    lw t1, 0(a3)
    lw t2, 0(a0)

        jal zero, programexit\n
                \n
    #\n
    # program exit point\n
    programexit:`;

    let testProgram=testProgram4;
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
        dataLabelsInfo:null,

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
        },
        writeByteToMemory: function(memaddr, value) {
            this.memory[memaddr]=value;
        },
        readByteFromMemory: function(memaddr) {
            return this.memory[memaddr];
        }


    };
    for (let i=0; i<32; i++) {
        myMachine.writeRegister(i, 0);
    }

    //ToDo: create room in the first n-line*4 bytes for a hypothetical binary instructions

    // Data processing here: first we go to the data section and process the data
    processDataSection(myMachine);
    // ToDo: parar de ejecutar cuando hay un error de datos

    //advance the currentProgramLine to the .text section, if it exists
    for (let i=0; i<myMachine.programCode.length; i++) {
        let myLine=myMachine.programCode[i];
        if (myLine.includes(".text")) {
            myMachine.currentProgramLine=i+1;
            break;
        }
    }

    // simulate execution
    try {
        while (myMachine.currentProgramLine<myMachine.programCode.length) {

            //clean the asm line of tabs, spaces and comments
            let cleanLine=cleanASMLine(myMachine.programCode[myMachine.currentProgramLine]);
            let firstToken=getFirstToken(myMachine.programCode[myMachine.currentProgramLine]);

            // try to execute line
            executeLine(cleanLine, myMachine, firstToken); //ToDo: inculde a warning when a line is not recognized as instruction or label

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

    //ToDo: check whether a line has a label that starts with a mnemonic name
    //ADDI
    if (firstTokenp.includes("addi")) {
        // decode line
        let decInstr=decodeRRILine(lineWithoutSpacesAndTabs.slice(4), machinep); // remove the mnemonic

        //execute line
        machinep.writeRegister(decInstr.operand1, machinep.readRegister(decInstr.operand2)+decInstr.immediate);

        document.getElementById('MyTextArea').value+="[ADDI x"+decInstr.operand1+" x"+decInstr.operand2+" "+decInstr.immediate+"]\n";        
    }

    //ANDI
    if (firstTokenp.includes("andi")) {
        //decode line
        let decInstr=decodeRRILine(lineWithoutSpacesAndTabs.slice(4), machinep); // remove the mnemonic

        //execute line
        machinep.writeRegister(decInstr.operand1, (machinep.readRegister(decInstr.operand2)&decInstr.immediate));

        document.getElementById('MyTextArea').value+="[ANDI x"+decInstr.operand1+" x"+decInstr.operand2+" "+decInstr.immediate+"]\n";
    }

    //SW
    if (firstTokenp.includes("sw")) {
        // decode line
        let decInstr=decodeRMEMLine(lineWithoutSpacesAndTabs.slice(2), machinep); // remove the mnemonic

        //execute line
        machinep.writeWordToMemory( machinep.readRegister(decInstr.operand2)+decInstr.immediate, machinep.readRegister(decInstr.operand1) );

        document.getElementById('MyTextArea').value+="[SW x"+decInstr.operand1+" IMM " +decInstr.immediate+ "( "+ decInstr.operand2+" )]\n";            
    }

    //LW
    if (firstTokenp.includes("lw")) {
        // decode line
        let decInstr=decodeRMEMLine(lineWithoutSpacesAndTabs.slice(2), machinep); // remove the mnemonic

        //execute line
        machinep.writeRegister(decInstr.operand1, machinep.readWordFromMemory(machinep.readRegister(decInstr.operand2)+decInstr.immediate) );

        document.getElementById('MyTextArea').value+="[LW x"+decInstr.operand1+" IMM " +decInstr.immediate+ "( "+ decInstr.operand2+" )]\n";            
    }

    //BLT
    if (firstTokenp.includes("blt")) {
        // decode line
        let decInstr=decodeRRLabel(lineWithoutSpacesAndTabs.slice(3), machinep); // remove the mnemonic

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

    //JAL
    if (firstTokenp.includes("jal")&&(!firstTokenp.includes("jalr"))) {
        let decInstr=decodeRLabelLine(lineWithoutSpacesAndTabs.slice(3), machinep); // remove the mnemonic

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

    //JALR
    if (firstTokenp.includes("jalr")) {
        let decInstr=decodeRMEMLine(lineWithoutSpacesAndTabs.slice(4), machinep); // remove the mnemonic

        // it's a jalr instruction, execute it
        machinep.writeRegister(decInstr.operand1, machinep.currentProgramLine);
        machinep.currentProgramLine=machinep.readRegister(decInstr.operand2)+decInstr.immediate;

        document.getElementById('MyTextArea').value+="[JALR x"+decInstr.operand1+" IMM " +decInstr.immediate+ "( "+ decInstr.operand2+" )]\n";            
    }

    // PSEUDOINSTRUCTIONS

    //LI
    if (firstTokenp.includes("li")) {
        let decInstr=decodeRIMMLine(lineWithoutSpacesAndTabs.slice(2), machinep); // remove the mnemonic

        // execute it
        machinep.writeRegister(decInstr.operand1, decInstr.immediate);

        document.getElementById('MyTextArea').value+="[LI x"+decInstr.operand1+" IMM " +decInstr.immediate+" ]\n";            
    }

    //LA
    if (firstTokenp.includes("la")) {
        let decInstr=decodeRLabelLine(lineWithoutSpacesAndTabs.slice(2), machinep); // remove the mnemonic

        // execute it
        //first we try to find the label in the data labels
        let labelFoundInData=false;
        let labelFoundInDataAddr;
        for (let el of machinep.dataLabelsInfo) {
            if (el.label==decInstr.label) {
                labelFoundInData=true;
                labelFoundInDataAddr=el.addr;
            }
        }
        // if it's not among the data labels, we try to find it among the code labels
        if (labelFoundInData) {
            machinep.writeRegister(decInstr.operand1, labelFoundInDataAddr);
        }
        else {
            let lln=findLabelInSource(machinep, decInstr.label);
            if (lln==-1) {
                throw new Error ("label not found in source");
            }
            else {
                machinep.writeRegister(decInstr.operand1, lln);
            }    
        }

        document.getElementById('MyTextArea').value+="[LA x"+decInstr.operand1+" LABEL " +decInstr.label+" ]\n";            
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

// decode instruction: instr R, imm(R)
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

// decode instructions: instr R, R, label
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

// decode instruction: instr R, label
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

// decode instruction: instr R, imm
function decodeRIMMLine(textLine, myMachinep) {
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
    if(op1==-1) {
        throw new Error ("ilegal instruction operands");
    }

    let decodedInstr = {
        operand1: op1,
        immediate: imm
    }
    
    return decodedInstr;
}

function processDataSection (myMachine) {
    let currentDataLine; // current data line
    let myDataLabels=[];
    try {
        let dataStarted=false;
        let currentDataAddr=myMachine.programCode.length*4; // we reserve space for future needs, like program instructions
        for (currentDataLine=0; currentDataLine<myMachine.programCode.length; currentDataLine++) {
            let dataLine=myMachine.programCode[currentDataLine];
            if (dataLine.includes(".data")) {
                dataStarted=true;
            }
            if (dataLine.includes(".text")) {
                dataStarted=false;
                break;
            }

            if (dataStarted) {
                let cleanDataLine=cleanASMLine(myMachine.programCode[currentDataLine]);

                if (cleanDataLine.includes(".word")) {
                    let imm=parseInt(cleanDataLine.slice(5));
                    if (isNaN(imm)) {
                        throw new Error ("ilegal immediate value");
                    } 

                    // write word to memory
                    myMachine.writeWordToMemory(currentDataAddr, imm)

                    currentDataAddr+=4; // increment data address pointer

                    // info output
                    document.getElementById('MyTextArea').value+="DATA .word: ["+imm+"]\n";
                }

                if (cleanDataLine.includes(".asciiz")) {
                    let splitDataLine=dataLine.split("\"");
                    if (splitDataLine.length!=3) {
                        throw new Error ("error in string");
                    }
                    let enteredString=splitDataLine[1].replace("\\n", "\n"); // by now, \n is the only special char we recognize

                    // write string to memory
                    for (let ii=0; ii<enteredString.length; ii++) {
                        myMachine.writeByteToMemory(currentDataAddr+ii, enteredString.codePointAt(ii));
                    }
                    myMachine.writeByteToMemory(currentDataAddr+enteredString.length, 0); // write null char

                    currentDataAddr+=enteredString.length+1; // include null, increment data address pointer

                    // info output
                    document.getElementById('MyTextArea').value+="DATA .asciiz: ["+enteredString+"]\n";
                }

                if (cleanDataLine[cleanDataLine.length-1]==":") {
                    let dataLabel=cleanDataLine.slice(0, cleanDataLine.length-1);

                    //add it to data labels list
                    let dataLabelNode= {
                        label:dataLabel,
                        addr:currentDataAddr
                    }
                    myDataLabels.push(dataLabelNode);

                    // info output
                    document.getElementById('MyTextArea').value+="DATA LABEL ["+dataLabel+"] at data addr ="+currentDataAddr+"\n";

                    //ToDo: instruction printing only when debuggin
                    //ToDo: error when data line not recognized
                }
            }
        }
    } catch (err) {
        document.getElementById('MyTextArea').value+="ERROR: "+err.message+ " in line "+(currentDataLine+1)+"\n";
    }
    myMachine.dataLabelsInfo=myDataLabels; // add the data labels info to the virtual machine
    // DEBUG info
    document.getElementById('MyTextArea').value+="DATA LABEL TABLE BEGIN \n";
    for (let i of myDataLabels) {
        document.getElementById('MyTextArea').value+="["+i.label+" addr ="+i.addr+"]\n";
    }
    document.getElementById('MyTextArea').value+="DATA LABEL TABLE END \n";
    //

}
