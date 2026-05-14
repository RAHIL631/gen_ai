import xml.etree.ElementTree as ET
import os
from typing import List, Dict, Any
from backend.utils.logger import get_logger

logger = get_logger(__name__)

# DrugBank XML Namespace
NS = "{http://www.drugbank.ca}"

class DrugBankExtractor:
    def __init__(self, xml_path: str):
        self.xml_path = xml_path

    def parse(self) -> List[Dict[str, Any]]:
        """Parses DrugBank XML iteratively to keep memory usage low."""
        logger.info(f"Starting extraction from: {self.xml_path}")
        interactions = []
        
        if not os.path.exists(self.xml_path):
            logger.warning(f"File {self.xml_path} not found. Proceeding with mock subset data for demonstration.")
            return self._get_mock_data()
            
        try:
            context = ET.iterparse(self.xml_path, events=("end",))
            _, root = next(context)
            
            for event, elem in context:
                if elem.tag == f"{NS}drug":
                    drug_name_elem = elem.find(f"{NS}name")
                    if drug_name_elem is None or not drug_name_elem.text:
                        elem.clear()
                        root.clear()
                        continue
                    
                    drug_a = drug_name_elem.text.strip()
                    
                    interactions_node = elem.find(f"{NS}drug-interactions")
                    if interactions_node is not None:
                        for interaction in interactions_node.findall(f"{NS}drug-interaction"):
                            drug_b_elem = interaction.find(f"{NS}name")
                            desc_elem = interaction.find(f"{NS}description")
                            
                            drug_b = drug_b_elem.text.strip() if drug_b_elem is not None and drug_b_elem.text else ""
                            desc = desc_elem.text.strip() if desc_elem is not None and desc_elem.text else ""
                            
                            if drug_b and desc:
                                interactions.append({
                                    "drug_a": drug_a,
                                    "drug_b": drug_b,
                                    "description": desc
                                })
                    
                    # Free memory for the element
                    elem.clear()
                    root.clear()
            
            logger.info(f"Successfully extracted {len(interactions)} raw interactions.")
        except Exception as e:
            logger.error(f"Error parsing XML: {str(e)}")
            
        return interactions

    def _get_mock_data(self) -> List[Dict[str, Any]]:
        return [
            {
                "drug_a": "Aspirin",
                "drug_b": "Warfarin",
                "description": "Aspirin may increase the anticoagulant activities of Warfarin."
            },
            {
                "drug_a": "Lisinopril",
                "drug_b": "Ibuprofen",
                "description": "Ibuprofen may decrease the antihypertensive activities of Lisinopril."
            },
            {
                "drug_a": "Simvastatin",
                "drug_b": "Amiodarone",
                "description": "The risk or severity of myopathy and rhabdomyolysis can be increased."
            },
            {
                "drug_a": "Sildenafil",
                "drug_b": "Isosorbide Mononitrate",
                "description": "The risk or severity of hypotension can be increased and is contraindicated."
            }
        ]
