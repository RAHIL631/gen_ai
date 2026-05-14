import csv
import os

def generate_dataset():
    data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
    os.makedirs(data_dir, exist_ok=True)
    csv_path = os.path.join(data_dir, 'real_interactions.csv')

    # Base curated interactions based on real clinical data
    base_interactions = [
        ("Aspirin", "Warfarin", "MAJOR", "Pharmacodynamic", "Aspirin may increase the anticoagulant activities of Warfarin. Increased risk of bleeding.", "Avoid combination or monitor INR closely."),
        ("Sildenafil", "Isosorbide Mononitrate", "CONTRAINDICATED", "Pharmacodynamic", "Sildenafil amplifies the vasodilatory effects of nitrates. Severe hypotension.", "Absolutely contraindicated."),
        ("Sildenafil", "Nitroglycerin", "CONTRAINDICATED", "Pharmacodynamic", "Sildenafil amplifies the vasodilatory effects of nitrates. Severe hypotension.", "Absolutely contraindicated."),
        ("Lisinopril", "Ibuprofen", "MODERATE", "Pharmacodynamic", "Ibuprofen may decrease the antihypertensive activities of Lisinopril and increase renal toxicity risk.", "Monitor blood pressure and renal function."),
        ("Simvastatin", "Amiodarone", "MAJOR", "Pharmacokinetic", "Amiodarone inhibits CYP3A4, increasing Simvastatin levels. High risk of myopathy/rhabdomyolysis.", "Limit simvastatin to 20 mg/day or use alternative statin."),
        ("Clopidogrel", "Omeprazole", "MAJOR", "Pharmacokinetic", "Omeprazole inhibits CYP2C19, reducing the active metabolite of Clopidogrel. Reduced antiplatelet effect.", "Use alternative PPI like pantoprazole."),
        ("Levothyroxine", "Calcium Carbonate", "MODERATE", "Pharmacokinetic", "Calcium carbonate binds to levothyroxine in the GI tract, reducing absorption.", "Separate administration by at least 4 hours."),
        ("Ciprofloxacin", "Calcium Carbonate", "MAJOR", "Pharmacokinetic", "Calcium forms insoluble chelates with Ciprofloxacin, drastically reducing absorption.", "Administer ciprofloxacin 2 hours before or 6 hours after calcium."),
        ("Spironolactone", "Lisinopril", "MAJOR", "Pharmacodynamic", "Both drugs increase serum potassium levels. Risk of severe hyperkalemia.", "Monitor serum potassium closely if combined."),
        ("Atorvastatin", "Clarithromycin", "MAJOR", "Pharmacokinetic", "Clarithromycin strongly inhibits CYP3A4, raising Atorvastatin levels. Rhabdomyolysis risk.", "Suspend atorvastatin during clarithromycin therapy."),
        ("Metronidazole", "Alcohol", "CONTRAINDICATED", "Pharmacodynamic", "Disulfiram-like reaction (nausea, vomiting, flushing, tachycardia).", "Avoid alcohol during and for 3 days after therapy."),
        ("Lithium", "Ibuprofen", "MAJOR", "Pharmacokinetic", "NSAIDs reduce renal clearance of lithium, leading to lithium toxicity.", "Avoid NSAIDs, use acetaminophen for pain."),
        ("Digoxin", "Amiodarone", "MAJOR", "Pharmacokinetic", "Amiodarone inhibits P-glycoprotein, doubling serum Digoxin levels. Risk of digoxin toxicity.", "Reduce digoxin dose by 50% and monitor levels."),
        ("Fluoxetine", "Phenelzine", "CONTRAINDICATED", "Pharmacodynamic", "Combination of SSRI and MAOI. High risk of fatal serotonin syndrome.", "Washout period of 5 weeks required before starting MAOI."),
        ("Sertraline", "St. John's Wort", "MAJOR", "Pharmacodynamic", "Additive serotonergic effects. Risk of serotonin syndrome.", "Avoid combination."),
        ("Alprazolam", "Ketoconazole", "MAJOR", "Pharmacokinetic", "Ketoconazole is a potent CYP3A4 inhibitor, increasing alprazolam toxicity (sedation, respiratory depression).", "Avoid combination or significantly reduce alprazolam dose."),
        ("Warfarin", "Fluconazole", "MAJOR", "Pharmacokinetic", "Fluconazole inhibits CYP2C9, significantly increasing Warfarin effects and bleeding risk.", "Monitor INR closely and adjust warfarin dose."),
        ("Methotrexate", "Trimethoprim", "CONTRAINDICATED", "Pharmacodynamic", "Additive antifolate effects leading to severe bone marrow suppression and pancytopenia.", "Avoid combination."),
        ("Tramadol", "Fluoxetine", "MAJOR", "Pharmacodynamic", "Fluoxetine inhibits CYP2D6 (reducing tramadol efficacy) and adds serotonergic effects (serotonin syndrome risk).", "Avoid combination, use alternative analgesic."),
        ("Azithromycin", "Ondansetron", "MODERATE", "Pharmacodynamic", "Both drugs can prolong the QT interval. Risk of Torsades de Pointes.", "Monitor ECG in patients with risk factors."),
        ("Insulin Glargine", "Propranolol", "MODERATE", "Pharmacodynamic", "Beta-blockers can mask symptoms of hypoglycemia (e.g., tachycardia).", "Educate patient on other signs of hypoglycemia (sweating)."),
        ("Rivaroxaban", "Phenytoin", "MAJOR", "Pharmacokinetic", "Phenytoin induces CYP3A4 and P-gp, decreasing Rivaroxaban efficacy and increasing stroke risk.", "Avoid combination."),
        ("Diltiazem", "Metoprolol", "MAJOR", "Pharmacodynamic", "Additive negative chronotropic and inotropic effects. Risk of severe bradycardia and heart block.", "Monitor heart rate and ECG closely."),
        ("Carbamazepine", "Oral Contraceptives", "MAJOR", "Pharmacokinetic", "Carbamazepine strongly induces hepatic enzymes, reducing efficacy of birth control. Pregnancy risk.", "Use alternative non-hormonal contraception."),
        ("Erythromycin", "Simvastatin", "CONTRAINDICATED", "Pharmacokinetic", "Erythromycin strongly inhibits CYP3A4. Very high risk of rhabdomyolysis.", "Contraindicated. Suspend statin or use alternative antibiotic."),
    ]

    # Synthesize more interactions to make the dataset "large" and trainable
    # We will expand synonyms and generic/brand name pairs
    synonyms = {
        "Aspirin": ["Acetylsalicylic Acid", "Ecotrin", "Bayer"],
        "Warfarin": ["Coumadin", "Jantoven"],
        "Sildenafil": ["Viagra", "Revatio"],
        "Lisinopril": ["Prinivil", "Zestril"],
        "Ibuprofen": ["Advil", "Motrin"],
        "Simvastatin": ["Zocor"],
        "Sertraline": ["Zoloft"],
        "Fluoxetine": ["Prozac"],
        "Omeprazole": ["Prilosec"],
        "Atorvastatin": ["Lipitor"],
        "Metoprolol": ["Lopressor", "Toprol XL"],
        "Alprazolam": ["Xanax"],
    }

    all_interactions = []
    
    for row in base_interactions:
        drug_a, drug_b, severity, type_, mech, rec = row
        all_interactions.append(row)
        
        # Add symmetric counterpart
        all_interactions.append((drug_b, drug_a, severity, type_, mech, rec))
        
        # Add synonym combinations
        syns_a = synonyms.get(drug_a, [])
        syns_b = synonyms.get(drug_b, [])
        
        for sa in syns_a:
            all_interactions.append((sa, drug_b, severity, type_, mech, rec))
            all_interactions.append((drug_b, sa, severity, type_, mech, rec))
        for sb in syns_b:
            all_interactions.append((drug_a, sb, severity, type_, mech, rec))
            all_interactions.append((sb, drug_a, severity, type_, mech, rec))
        for sa in syns_a:
            for sb in syns_b:
                all_interactions.append((sa, sb, severity, type_, mech, rec))
                all_interactions.append((sb, sa, severity, type_, mech, rec))

    # Add random safe combinations
    safe_drugs = ["Vitamin C", "Vitamin D", "Biotin", "Folic Acid", "Zinc", "Magnesium", "Loratadine", "Cetirizine", "Amoxicillin", "Cephalexin"]
    for i in range(len(safe_drugs)):
        for j in range(i+1, len(safe_drugs)):
            all_interactions.append((safe_drugs[i], safe_drugs[j], "LOW", "None", "No clinically significant interaction expected.", "Standard dosing appropriate."))
            all_interactions.append((safe_drugs[j], safe_drugs[i], "LOW", "None", "No clinically significant interaction expected.", "Standard dosing appropriate."))

    # Write to CSV
    with open(csv_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(["drug_a", "drug_b", "severity", "interaction_type", "mechanism", "recommendation"])
        for row in all_interactions:
            writer.writerow(row)
            
    print(f"Generated {len(all_interactions)} interactions at {csv_path}")

if __name__ == "__main__":
    generate_dataset()
